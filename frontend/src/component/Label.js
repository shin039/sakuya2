import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

function Label(props) {
  return (
    <Typography color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Label.propTypes = {
  children: PropTypes.node,
};

export default Label;
