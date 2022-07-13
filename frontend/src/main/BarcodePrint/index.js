// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useEffect, useState } from 'react';
// Material UI
import Box       from '@mui/material/Box';
import Button    from '@mui/material/Button';
import Divider   from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import List           from '@mui/material/List';
import ListItem       from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText   from '@mui/material/ListItemText';

import { DataGrid } from '@mui/x-data-grid';

// Proprietary 
import {apiGet}     from 'api'
import DisplayFrame from 'component/DisplayFrame/SinglePanel';
import Title        from 'component/Title';

// -----------------------------------------------------------------------------
//  Const
// -----------------------------------------------------------------------------
const _LIST_ROW_SIZE = 10;

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const handleSubmit = (event, setGlist) => {
  event.preventDefault();
  const data       = new FormData(event.currentTarget);
  const goods_name = data.get('goods_name');

  const f_success = response => setGlist((response && response.data && response.data.result) || []);
  apiGet({url: 'goods', o_params: {limit: 100, goods_name}, f_success});
};

const addPrintList = (slist, plist, setPlist) => {
  if(! slist || (slist && slist.length === 0)) return;

  // 重複を除去してマージする。
  const arr_merged = Array.from(new Set([...plist, ...slist]));
  setPlist(arr_merged);
};
// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
const _dg_columns = [
  { field: 'name'    , headerName: 'Name', width: 230 },
  { field: 'jan'     , headerName: 'JAN' , width: 130 },
  {
    field: 'PriceTax',
    headerName: 'Price & Tax',
    description: 'for sample, customize column.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.rt_price || ''} ${params.row.tax_rate || ''}`,
  },
];

// 検索条件表示部
const search_content = (setGlist) => {
  return (
    <>
      <Title>Goods List</Title>
      <Box component="form" onSubmit={event => handleSubmit(event, setGlist)} noValidate sx={{ mt: 1 }}>
        <TextField margin="normal" id="goods_name" label="Goods Name" name="goods_name" variant="outlined" error={false}/>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Search </Button>
      </Box>
    </>
  );
}

// 検索結果表示部
const list_content = (glist, slist, setSlist, plist, setPlist) => {

  return (
    <>
      <div style={{height: 450}}>
        <DataGrid
          density='compact'
          autoHeight
          rows={glist}
          columns={_dg_columns}
          getRowId={(row) => row.goods_id}
          pageSize={_LIST_ROW_SIZE}
          rowsPerPageOptions={[_LIST_ROW_SIZE]}
          checkboxSelection
          onSelectionModelChange={(ids)=>{setSlist(ids)}}
        />
      </div>
      <Button fullWidth variant="contained" onClick={()=>addPrintList(slist, plist, setPlist)} sx={{ mt: 3, mb: 2 }} > ADD </Button>
    </>
  );
}

// 印刷リスト表示部
const print_content = (glist, plist) => {
  const createRecord = record => {

    const {
      goods_id,
      name,
      jan,
      rt_price,
    } = record;

    const makeDetail = (name) => <span style={{color: 'red'}}>{name}<TextField/></span>;

    return (
       <ListItem key={goods_id} disablePadding>
          <ListItemButton>
            <ListItemText primary={makeDetail(name)} />
          </ListItemButton>
      </ListItem>
    );
  };

   
  return (plist.length <= 0)? '' :(
    <>
      <Title>Print List</Title>
      <List>
        {plist.map(gid => {
          const goods_info = glist.find((record) => record.goods_id === gid);
          return createRecord(goods_info);
        })}
      </List>
      <Button fullWidth variant="contained" onClick={()=>{/* TODO 印刷処理*/}} sx={{ mt: 3, mb: 2 }} > Print </Button>
    </>
  );
}

const BarcodePrint = () => {

  // State 定義
  const [st_goodsList   , setGoodsList  ] = useState([]);
  const [st_selectedList, setSlectedList] = useState([]);
  const [st_printList   , setPrintList  ] = useState([]);

  // マウント時に実行
  useEffect(() => {
    // TODO カテゴリを取得する
    //const f_success = response => setGoodsList((response && response.data && response.data.result) || []);
    //apiGet({url: 'goods', o_params: {limit: 100}, f_success});
  }, []);

  return (
    <DisplayFrame title='Barcode Print'>
      {search_content(setGoodsList)}
      <Divider style={{marginBottom: '1vh'}}/>
      {list_content(st_goodsList, st_selectedList, setSlectedList, st_printList, setPrintList)}
      <Divider style={{marginBottom: '1vh'}}/>
      {print_content(st_goodsList, st_printList)}
    </DisplayFrame>
  );
}

export default BarcodePrint;
