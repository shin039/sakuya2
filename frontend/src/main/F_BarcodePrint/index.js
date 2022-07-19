// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useEffect, useState } from 'react';
// Material UI
import Box       from '@mui/material/Box';
import Button    from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Select      from '@mui/material/Select';
import MenuItem    from '@mui/material/MenuItem';
import InputLabel  from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import List           from '@mui/material/List';
import ListItem       from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText   from '@mui/material/ListItemText';

import Grid       from '@mui/material/Grid';
import Paper      from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { DataGrid } from '@mui/x-data-grid';

// Proprietary 
import util         from 'common/util';
import {apiGet}     from 'api';
import DisplayFrame from 'component/DisplayFrame/MultiPanel';
import Title        from 'component/Title';

// Excel Export
import EXCEL           from 'exceljs';
import {downloadExcel} from 'common/excel';

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
  const category   = data.get('category');
  const maker      = data.get('maker');
  const discount   = data.get('discount');

  const f_success = response => setGlist((response && response.data && response.data.result) || []);
  apiGet({url: 'goods', o_params: {limit: 1000, goods_name, category, maker, discount}, f_success});
};

// -----------------------------------------------------------------------------
// Render
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 検索条件表示部
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const search_content = (categories, makers, discounts, setGlist) => {

  const sel_category = (categories.length > 0)?(
    <FormControl sx={{minWidth: 150}}>
      <InputLabel id="category_label">Category</InputLabel>
      <Select id='category' name='category' defaultValue={0} label="Category" labelId='category_label'>
        <MenuItem value={0} key={0}>ALL</MenuItem>
        {categories.map(category => {
          return <MenuItem value={category.category} key={category.category}>{category.name}</MenuItem>}
        )}
      </Select>
    </FormControl>
  ): '';

  const sel_maker = (makers.length > 0)?(
    <FormControl sx={{minWidth: 150}}>
      <InputLabel id="maker_label">Maker</InputLabel>
      <Select id='maker' name='maker' defaultValue={0} label="Maker" labelId='maker_label'>
        <MenuItem value={0} key={0}>ALL</MenuItem>
        {makers.map( maker => {
          return <MenuItem value={maker.company_id} key={maker.company_id}>{maker.name}</MenuItem>}
        )}
      </Select>
    </FormControl>
  ): '';

  const sel_discount = (discounts.length > 0)?(
    <FormControl sx={{minWidth: 170}}>
      <InputLabel id="discount_label">Discount Price</InputLabel>
      <Select id='discount' name='discount' defaultValue={0} label="Discount Price" labelId='discount_label'>
        <MenuItem value={0} key={0}>Basic</MenuItem>
        {discounts.map( discount => {
          return <MenuItem value={discount.company_id} key={discount.company_id}>{discount.name}</MenuItem>}
        )}
      </Select>
    </FormControl>
  ): '';

  const tf_goodsname = <TextField id="goods_name" label="Goods Name" name="goods_name" variant="outlined" error={false} />;

  return (
    <>
      <Title>Search Condition</Title>
      <Box component="form" onSubmit={event => handleSubmit(event, setGlist)} noValidate sx={{ mt: 1 }}>
        <Grid container direction='row' alignItems='center' spacing={1}>
          <Grid item xs= {3}>{sel_category}</Grid>
          <Grid item xs= {3}>{sel_maker}</Grid>
          <Grid item xs= {6}>{tf_goodsname}</Grid>
          <Grid item xs= {3}>{sel_discount}</Grid>
          <Grid item xs={12}><Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Search </Button></Grid>
        </Grid>
      </Box>
    </>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 検索結果表示部
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const list_content = (glist, plist, setPlist) => {

  const selectActioin = (goods_id, glist, slist, setPlist) => {
    const goods_info = glist.find((record) => record.goods_id === goods_id);

    // 同じものが登録されないようにチェック
    const is_duplicated = typeof (plist.find((record) => record.goods_id === goods_id)) !== 'undefined' ;
    if(is_duplicated) return;

    // 重複を除去してマージする。
    const arr_merged = Array.from(new Set([...plist, goods_info]));
    setPlist(arr_merged);
  }


  const dg_columns = [
    { field: 'name'      , headerName: 'Name' , width: 230 },
    { field: 't01_name'  , headerName: 'Color', width: 100 },
    { field: 't02_name'  , headerName: 'Size' , width: 100 },
    {
      field: 'price_taxin',
      headerName: 'Price (tax in)',
      description: 'Tax Included Retail Price',
      sortable: false,
      width: 100,
      valueGetter: (params) => util.formatYen(util.calcTaxed(params.row.rt_price ,params.row.tax_rate)) ,
    },
    { field: 'jan'       , headerName: 'JAN'  , width: 130 },
    { field: 'maker_name', headerName: 'Maker', width: 150 },
  ];

  return (
    <>
      <Title>Goods List</Title>
      <div style={{height: 450}}>
        <DataGrid
          density='compact'
          autoHeight
          rows={glist}
          columns={dg_columns}
          getRowId={(row) => row.goods_id}
          pageSize={_LIST_ROW_SIZE}
          rowsPerPageOptions={[_LIST_ROW_SIZE]}
          onRowClick={(params) => selectActioin(params.id, glist, plist, setPlist) }
        />
      </div>
    </>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 印刷リスト表示部
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const print_content = (glist, plist, setPlist) => {

  const createRecord = record => {

    const {
      goods_id,
      name,
      jan,
      rt_price,
      tax_rate,
      t01_name,
      t02_name,
    } = record;

    const deleteAction = () => {
      const tmpList = [...plist];
      const index   = tmpList.findIndex((record) => record.goods_id === goods_id)
      tmpList.splice(index, 1)
      setPlist(tmpList);
    }

    const makeDetail = (name) => {
      return (
      <Grid container direction='row' alignItems='center' spacing={0}>
        <Grid item xs={2}> {name}</Grid>
        <Grid item xs={2}> {t01_name}</Grid>
        <Grid item xs={2}> {t02_name}</Grid>
        <Grid item xs={2}> {jan}</Grid>
        <Grid item xs={1}> {util.formatYen(util.calcTaxed(rt_price, tax_rate))}</Grid>
        <Grid item xs={2}><TextField name={`num_${goods_id}`} type='number' defaultValue={1} inputProps={{min: 0, max: 100}} size='small'/></Grid>
        <Grid item xs={1}><IconButton size='small' onClick={deleteAction}><DeleteIcon /></IconButton></Grid>
      </Grid>
      );
    }

    return (
       <ListItem key={goods_id} disablePadding>
          <ListItemButton>
            <ListItemText primary={makeDetail(name)} />
          </ListItemButton>
      </ListItem>
    );
  };

  const allDeleteAction = () => {setPlist([])}
   
  return (
    <Box component="form" onSubmit={event => excel_export(event, plist)} noValidate sx={{ mt: 1 }}>
      <Grid container direction='row' alignItems='center' spacing={0}>
        <Grid item xs={11}><Title>Print List</Title></Grid>
        <Grid item xs={1}><IconButton size='small' onClick={allDeleteAction}><DeleteIcon /></IconButton></Grid>
      </Grid>
      <List>
        {plist.map(goods_info => createRecord(goods_info))}
      </List>
      {plist.length > 0 &&
        <Button type='submit' fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Print </Button>
      }
    </Box>
  );
}

// Client side Excel Download
const excel_export = (event, plist) => {
  event.preventDefault();

  const workbook  = new EXCEL.Workbook();
  const worksheet = workbook.addWorksheet('barcode list');

  const exl_title = {
    fill     : {type: 'pattern', pattern:'solid', fgColor:{argb:'FF8EA9DB'}},
    font     : { color: { argb: 'FF000000' }, size: 11, bold: false, underline: false },
    alignment: { horizontal: 'center', vertical: 'middle' },
  }

  const title_value = [
    'カテゴリ',
    '商品名',
    '色・柄',
    'サイズ',
    '税抜価格表記',
    'JAN',
    '総額表記',
  ]

  // make Header
  for(const index in title_value){
    const title     = worksheet.getCell(1, (Number(index) + 1));
    title.value     = title_value[index];
    title.fill      = exl_title.fill;
    title.font      = exl_title.font;
    title.alignment = exl_title.alignment;
  }

  // make Content
  const form_data = new FormData(event.currentTarget);
  let offset = 2; // 2行目からスタートするので。

  const getYMD    = (dt) => {
     const y = dt.getFullYear();
     const m = ('00' + (dt.getMonth()+1)).slice(-2);
     const d = ('00' + dt.getDate()).slice(-2);
     return (y  + m  + d);
  }

  for(const record of plist){
    const num_of_print = Number(form_data.get(`num_${record.goods_id}`));

    // ROW
    for(let i=0; i<num_of_print; i++){

      const content_value = [
        record.category_name,
        record.name,
        record.t01_name,
        record.t02_name,
        record.rt_price,
        record.jan,
        util.calcTaxed(record.rt_price, record.tax_rate),
      ];

      const cell_format_yen = '"\\"#,##0;[Red]"\\"-#,##0';

      const format = [ '', '', '', '', cell_format_yen, '', cell_format_yen ];

      const getval =  (val, colIdx) => {
        if (false) return util.dateToStr(val);             // 日付
        if ([4, 6].includes(colIdx)) return parseInt(val); // 金額
        if (false) return Number(val);                     // 数値
        return val;                                        // 文字列
      };

      // Column
      for(const index in content_value){
        const content  = worksheet.getCell(offset, (Number(index) + 1));
        const value    = content_value[index];
        content.numFmt = format[index];
        content.value  = getval(value, Number(index));
      }
      // Set Next Row
      offset++;
    }
  }

  downloadExcel(workbook, `${getYMD(new Date())}_バーコード印刷ファイル`);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Main
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const BarcodePrint = () => {

  // State 定義
  const [st_goodsList, setGoodsList  ] = useState([]);
  const [st_printList, setPrintList  ] = useState([]);
  const [m_categories, setCategories ] = useState([]);
  const [m_makers    , setMakers     ] = useState([]);
  const [m_discounts    , setDiscounts     ] = useState([]); // 卸先

  // マウント時に実行
  useEffect(() => {
    // 検索条件のセレクトボックスに使うデータを取得する
    const f_success_cat      = response => setCategories((response && response.data && response.data.result) || []);
    const f_success_maker    = response => setMakers    ((response && response.data && response.data.result) || []);
    const f_success_discount = response => setDiscounts ((response && response.data && response.data.result) || []);

    apiGet({url: 'category'        , f_success: f_success_cat});
    apiGet({url: 'company'         , f_success: f_success_maker, o_params: {is_supplier: true} });
    apiGet({url: 'discount/company', f_success: f_success_discount});
  }, []);

  return (
    <DisplayFrame title='Barcode Print'>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}} >
            {search_content(m_categories, m_makers, m_discounts, setGoodsList)}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}} >
            {list_content(st_goodsList, st_printList, setPrintList)}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}} >
            {print_content(st_goodsList, st_printList, setPrintList)}
          </Paper>
        </Grid>

      </Grid>
    </DisplayFrame>
  );
}

export default BarcodePrint;
