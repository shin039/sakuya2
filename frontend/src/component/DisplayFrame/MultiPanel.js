// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jaJP }                       from '@mui/x-data-grid';
import CssBaseline                    from '@mui/material/CssBaseline';
import Box                            from '@mui/material/Box';
import Toolbar                        from '@mui/material/Toolbar';
import Container                      from '@mui/material/Container';

// react router
import { useLocation } from 'react-router-dom';

// Color
import {palette} from 'common/color'

// Proprietary Library
import GeneralMenu from 'component/DisplayFrame/GeneralMenu';
import CopyRight   from 'component/CopyRight';

import { MENU_LIST, MENU_SECONDARY_LIST, MENU_NOMENU_LIST } from 'common/const';

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const mdTheme = createTheme(palette, jaJP);

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
export default function MultiPanel(args){
  const {children} = args;

  // Title 名を取得する
  const path      = useLocation();
  const path_list = [...MENU_LIST, ...MENU_SECONDARY_LIST, ...MENU_NOMENU_LIST];
  const menu_info = path_list.filter((menuInfo) => `/${menuInfo.path}` === path.pathname);
  const title     = (menu_info && menu_info[0] && menu_info[0].title) || '';

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <GeneralMenu title={title} />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100]: theme.palette.grey[900],
            flexGrow       : 1,
            height         : '100vh',
            overflow       : 'auto',
          }}
        >
        {/* FlexのHUPメニューを取っているので、その分のレイアウト高を保持してレイアウト崩れがないようにしている。 */}
        <Toolbar />

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Main Component */}
            {children}

            {/* Copy Right */}
            <CopyRight sx={{ pt: 4 }} />

          </Container>
        </Box>
      </Box>
    </ThemeProvider>

  );
}
