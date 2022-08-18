// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import { useContext }  from 'react';
import { CTX_USER }    from 'main/route_factory';
import { useCookies }  from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import Avatar           from '@mui/material/Avatar';
import Button           from '@mui/material/Button';
import CssBaseline      from '@mui/material/CssBaseline';
import TextField        from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox         from '@mui/material/Checkbox';
import Link             from '@mui/material/Link';
import Grid             from '@mui/material/Grid';
import Box              from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography       from '@mui/material/Typography';
import Container        from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CopyRight from 'component/CopyRight';
import {apiPost}  from 'api'

// Color
import {palette} from 'common/color'

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
const mdTheme = createTheme(palette);

export default function SignIn() {
  const navigate            = useNavigate();
  const ctx_user            = useContext(CTX_USER);
  const [cookie, setCookie] = useCookies(['_sakuya']);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data     = new FormData(event.currentTarget);
    const userid   = data.get('userid');
    const password = data.get('password');

    const f_success = response => {

      // ログイン情報をコンテクストに設定
      ctx_user.setUserInfo({...ctx_user.userInfo, userid: userid});

      // ログイン情報をCookieにも設定
      //   -> F5やURL直打ちへの対策。コンテクストはクリアされてしまうので。
      const cookie_val = cookie._sakuya || {};
      cookie_val.userInfo = {...cookie_val.userInfo}
      cookie_val.userInfo.userid = userid;
      setCookie('_sakuya', cookie_val, {sameSite: 'Lax'});

      // メインページへの遷移
      navigate('/main');
    }
    
    apiPost({url: 'login', o_params:{userid, password}, f_success});
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >

          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> <LockOutlinedIcon /> </Avatar>
          <Typography component="h1" variant="h5">Sign in</Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userid"
              label="User Id"
              name="userid"
              autoComplete="userid"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Sign In </Button>

            <Grid container>
              <Grid item xs><Link href="#" variant="body2">Forgot password?</Link></Grid>
              <Grid item>   <Link href="#" variant="body2">{"Don't have an account? Sign Up"}</Link></Grid>
            </Grid>

            {/* Copy Right */}
            <CopyRight style={{marginTop: '2em'}} />

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
