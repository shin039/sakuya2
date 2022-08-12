// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useState } from 'react';
// Material UI
import { TextField } from '@mui/material';
// Date Picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Main
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const DatePicker = (props) => {

  // Label名
  const label   = props.label   || '';
  const format  = props.format  || 'YYYY/MM/DD';
  const err_msg = props.err_msg || '';

  // State 定義
  const [st_date, setDate] = useState(null);
  const [st_err , setErr]  = useState(null);

  // 初期値設定
  if(st_date === null && props.init_val) setDate(props.init_val);

  return (
    <DesktopDatePicker
      label={label}
      inputFormat={format}
      value={st_date}
      onChange={(value)=>setDate(value)}
      onError={(reason, value)=> {
        if(reason === null) setErr('');
        else                setErr(err_msg || reason);
      }}
      renderInput={(params) => <TextField {...params} {...props} helperText={st_err} />}
    />
  );
}

export default DatePicker;
