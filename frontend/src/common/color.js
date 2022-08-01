import { blueGrey, orange, grey } from '@mui/material/colors';

// Material-ui v5
//   Style
// NOTE: https://mui.com/material-ui/customization/default-theme/
//       https://mui.com/material-ui/customization/theming/
//       https://mui.com/material-ui/customization/color/
export const palette = {
  palette: {
    mode     : 'light',
    primary  : blueGrey,
    secondary: orange,
    divider  : blueGrey[200],
    text: {
      primary  : grey[900],
      secondary: grey[800],
    },
    label: {
      main    : grey[200],
      mainText: grey[900],
      odd     : grey[200],
      even    : blueGrey[100],
    }
  }
}
