import Typography from '@mui/material/Typography';
import Link       from '@mui/material/Link';

const copyright = (props) => {

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:2000/link?param=link"> Your Website </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default copyright;
