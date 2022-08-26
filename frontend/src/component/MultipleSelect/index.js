// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useState } from 'react';
// Material UI
import Select       from '@mui/material/Select';
import MenuItem     from '@mui/material/MenuItem';
import Checkbox     from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Button       from '@mui/material/Button';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Main
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const DatePicker = (props) => {
  const {
    itemInfo     = {items: [], item_key: '', item_name: ''},
    id,
    name,
    label        = '',
    labelId      = '',
    style        = {width: '250px'},
    defaultValue = [],
    error        = false,
  } = props;

  const ALL = "ALL";
  const {items, item_key, item_name} = itemInfo;


  // State 定義
  const [st_selected, setSelected] = useState([]);
  const [st_isAll   , setIsAll]    = useState(false);

  // Functioon
  const clickAll = () => {
    // isAll false -> true
    if(! st_isAll) {
      setIsAll(true);
      setSelected([]);
    }
    // isAll false -> true
    else {
      setIsAll(false);
      const setval = items.map(record => record[item_key])
      setSelected(setval);
    }
  }

  const onchange = (event) => {
    const {target: {value}} = event;
    setSelected( typeof value === 'string' ? value.split(',') : value,);
  }

  const render = (selected) => {
    const arr_selected = items
                         .filter(record => selected.indexOf(record[item_key]) > -1 )
                         .map   (record => record[item_name]);
    
    return arr_selected.join(', ')
  }

  // Render
  return (
      <Select
        id={id}
        name={name}
        onChange={onchange}
        renderValue={render}
        defaultValue={defaultValue}
        multiple
        label={label}
        labelId={labelId}
        style={style}
        value={st_selected} 
        error={error}
      >
        <Button onClick={clickAll} color="primary" variant='outlined' style={{marginLeft:'1em'}}>{ALL}</Button>
        {items.map(item => {
          return (
            <MenuItem value={item[item_key]} key={item[item_key]}>
              <Checkbox checked={st_selected.indexOf(item[item_key]) > -1} />
              <ListItemText primary={item[item_name]} />
            </MenuItem>);
        })}
      </Select>
  );
}

export default DatePicker;
