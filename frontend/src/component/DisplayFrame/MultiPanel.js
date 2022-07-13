// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jaJP }                       from '@mui/x-data-grid';
import CssBaseline                    from '@mui/material/CssBaseline';
import Box                            from '@mui/material/Box';
import Toolbar                        from '@mui/material/Toolbar';
import Container                      from '@mui/material/Container';


// Proprietary Library
import GeneralMenu from 'component/DisplayFrame/GeneralMenu';
import CopyRight   from 'component/CopyRight';

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const mdTheme = createTheme({}, jaJP);

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
export default function MultiPanel(args){
  const {title, children} = args;

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
