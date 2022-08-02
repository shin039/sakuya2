import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

function Title(props) {

  const {component, style, children} = props;

  return (
    <Typography component={component || 'h2'} variant="h6" color="primary" style={style} gutterBottom>
      {children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
