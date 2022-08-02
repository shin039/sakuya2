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

import Grid       from '@mui/material/Grid';
import Paper      from '@mui/material/Paper';

import { DataGrid } from '@mui/x-data-grid';

// Proprietary 
import DETAIL       from 'main/CM_Goods/detail';
import {apiGet}     from 'api'
import DisplayFrame from 'component/DisplayFrame/MultiPanel';
import Title        from 'component/Title';

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const handleSubmit = (event, setGlist) => {
  event.preventDefault();
  const data       = new FormData(event.currentTarget);
  const goods_name = data.get('goods_name');
  const category   = data.get('category');
  const maker      = data.get('maker');
  const not_sku    = true;

  const f_success = response => setGlist((response && response.data && response.data.result) || []);
  apiGet({url: 'goods', o_params: {limit: 1000, goods_name, category, maker, not_sku}, f_success});
};

// -----------------------------------------------------------------------------
// Render
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 検索条件表示部
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const search_content = (categories, makers, setGlist) => {

  const sel_category = (categories.length > 0)?(
    <FormControl sx={{minWidth: 150}}>
      <InputLabel id="category_label">カテゴリー</InputLabel>
      <Select id='category' name='category' defaultValue={0} label="カテゴリー" labelId='category_label'>
        <MenuItem value={0} key={0}>ALL</MenuItem>
        {categories.map(category => {
          return <MenuItem value={category.category} key={category.category}>{category.name}</MenuItem>}
        )}
      </Select>
    </FormControl>
  ): '';

  const sel_maker = (makers.length > 0)?(
    <FormControl sx={{minWidth: 150}}>
      <InputLabel id="maker_label">メーカー</InputLabel>
      <Select id='maker' name='maker' defaultValue={0} label="メーカー" labelId='maker_label'>
        <MenuItem value={0} key={0}>ALL</MenuItem>
        {makers.map( maker => {
          return <MenuItem value={maker.company_id} key={maker.company_id}>{maker.name}</MenuItem>}
        )}
      </Select>
    </FormControl>
  ): '';

  const tf_goodsname = <TextField id="goods_name" label="商品名" name="goods_name" variant="outlined" error={false} />;

  return (
    <>
      <Title>検索条件</Title>
      <Box component="form" onSubmit={event => handleSubmit(event, setGlist)} noValidate sx={{ mt: 1 }}>
        <Grid container direction='row' alignItems='center' spacing={1}>
          <Grid item xs= {3}>{sel_category}</Grid>
          <Grid item xs= {3}>{sel_maker}</Grid>
          <Grid item xs= {6}>{tf_goodsname}</Grid>
          <Grid item xs={12}><Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >検　索</Button></Grid>
        </Grid>
      </Box>
    </>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 検索結果表示部
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const list_content = (stateSet) => {

  const {st_goodsList, o_rowNum, setRowNum, open, setOpen, d_goodsId, setDGoodsId} = stateSet;
  
  
  const i_rowNum      = o_rowNum.num;
  const is_error      = o_rowNum.error;

  const _DISP_MIN     = 1;
  const _DISP_MAX     = 100;
  const row_height    = 36;
  const footer_height = 100;
  const _LIST_HEIGHT  = (i_rowNum * row_height) + footer_height;

  const openDetailDialog = (goods_id) => {
    setDGoodsId(goods_id);
    setOpen(true);
  }


  const is_rowNumOK = (rowNum)    => (_DISP_MIN <= rowNum && rowNum <= _DISP_MAX);

  const onChange = (event) => {
    const input = Number(event.target.value);
    if(is_rowNumOK(input)) setRowNum({num: input   , error: false});
    else                     setRowNum({num: i_rowNum, error: true});
  }

  const status_rowNum = (! is_error)?{error: false, helperText: ''}: {error: true, helperText: `Input, ${_DISP_MIN} ～ ${_DISP_MAX}.`};

  const dg_columns = [
    { field: 'category_name', headerName: 'カテゴリー', width: 200 },
    { field: 'name'         , headerName: '商品名'    , width: 300 },
    { field: 'maker_name'   , headerName: 'メーカー名', width: 150 },
  ];

  return (
    <>
      <Title>商品リスト</Title>

      <DETAIL fromParent={{open, setOpen, d_goodsId}} />

      <Grid container direction='row' justifyContent='flex-start' alignItems='center' spacing={1} style={{marginBottom: '1em'}}>
        <Grid item xs= {2}>
          <TextField {...status_rowNum} onChange={onChange} type='number' label='表示行数' defaultValue={i_rowNum} inputProps={{min: _DISP_MIN, max: _DISP_MAX}} size='small'/>
        </Grid>
      </Grid>
      
      <div style={{height: _LIST_HEIGHT}}>
        <DataGrid
          density='compact'
          autoHeight
          rows={st_goodsList}
          columns={dg_columns}
          getRowId={(row) => row.goods_id}
          pageSize={i_rowNum}
          rowsPerPageOptions={[i_rowNum]}
          onRowClick={(params) => openDetailDialog(params.id) }
        />
      </div>
    </>
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Main
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const GoodsList = () => {

  // State 定義
  const [st_goodsList, setGoodsList ] = useState([]);
  const [m_categories, setCategories] = useState([]);
  const [m_makers    , setMakers    ] = useState([]);
  const [o_rowNum    , setRowNum    ] = useState({num:20, error: false});

  const [open        , setOpen      ] = useState(false);
  const [d_goodsId   , setDGoodsId  ] = useState(null);

  // マウント時に実行
  useEffect(() => {
    // 検索条件のセレクトボックスに使うデータを取得する
    const f_success_cat      = response => setCategories((response && response.data && response.data.result) || []);
    const f_success_maker    = response => setMakers    ((response && response.data && response.data.result) || []);

    apiGet({url: 'category'        , f_success: f_success_cat});
    apiGet({url: 'company'         , f_success: f_success_maker, o_params: {is_supplier: true} });
  }, []);

  const stateSet = {st_goodsList, o_rowNum, setRowNum, open, setOpen, d_goodsId, setDGoodsId};

  return (
    <DisplayFrame>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}} >
            {search_content(m_categories, m_makers, setGoodsList)}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}} >
            {list_content(stateSet)}
          </Paper>
        </Grid>

      </Grid>
    </DisplayFrame>
  );
}

export default GoodsList;
