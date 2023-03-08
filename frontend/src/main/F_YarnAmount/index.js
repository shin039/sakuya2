// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useState } from 'react';

// Material UI
import {
  Box
 ,Button
 ,TextField
 ,Grid
 ,Paper
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

// Proprietary 
import DETAIL       from 'main/F_YarnAmount/detail';
import {apiGet}     from 'api'
import DisplayFrame from 'component/DisplayFrame/MultiPanel';
import Title        from 'component/Title';

// Context
import { useContext }  from 'react';
import { CTX_USER }    from 'main/route_factory';

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const handleSubmit = (event, setGlist, commonFunc) => {
  event.preventDefault();
  const data       = new FormData(event.currentTarget);
  const goods_name = data.get('goods_name');
  const category   = data.get('category');

  const f_success = response => setGlist((response && response.data && response.data.result) || []);
  apiGet({url: 'goods', o_params: {goods_name, category}, f_success, commonFunc});
};

// -----------------------------------------------------------------------------
// Render
// -----------------------------------------------------------------------------

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 検索条件表示部
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const search_content = (setGlist, commonFunc) => {

  const tf_goodsname = <TextField id="goods_name" label="商品名" name="goods_name" variant="outlined" error={false} />;

  return (
    <>
      <Title>検索条件</Title>
      <Box component="form" onSubmit={event => handleSubmit(event, setGlist, commonFunc)} noValidate sx={{ mt: 1 }}>
        <input type="hidden" id='category' name='category' value={10} />
        <Grid container direction='row' alignItems='center' spacing={1}>
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
//
const get_dgColumns = (skuInfo) => {
  const columns = [{ field: 'name'    , headerName: '商品名'          , width: 300 }];
  if(skuInfo && skuInfo.t01_name)columns.push({ field: 't01_name', headerName: skuInfo.t_t01_name, width: 130 });
  if(skuInfo && skuInfo.t02_name)columns.push({ field: 't02_name', headerName: skuInfo.t_t02_name, width: 130 });
  if(skuInfo && skuInfo.t03_name)columns.push({ field: 't03_name', headerName: skuInfo.t_t03_name, width: 130 });
  if(skuInfo && skuInfo.t04_name)columns.push({ field: 't04_name', headerName: skuInfo.t_t04_name, width: 130 });
  if(skuInfo && skuInfo.t05_name)columns.push({ field: 't05_name', headerName: skuInfo.t_t05_name, width: 130 });
  if(skuInfo && skuInfo.i01_name)columns.push({ field: 'i01_name', headerName: skuInfo.t_i01_name, width: 130 });
  if(skuInfo && skuInfo.i02_name)columns.push({ field: 'i02_name', headerName: skuInfo.t_i02_name, width: 130 });
  if(skuInfo && skuInfo.i03_name)columns.push({ field: 'i03_name', headerName: skuInfo.t_i03_name, width: 130 });
  if(skuInfo && skuInfo.i04_name)columns.push({ field: 'i04_name', headerName: skuInfo.t_i04_name, width: 130 });
  if(skuInfo && skuInfo.i05_name)columns.push({ field: 'i05_name', headerName: skuInfo.t_i05_name, width: 130 });
  if(skuInfo && skuInfo.n01_name)columns.push({ field: 'n01_name', headerName: skuInfo.t_n01_name, width: 130 });
  if(skuInfo && skuInfo.n02_name)columns.push({ field: 'n02_name', headerName: skuInfo.t_n02_name, width: 130 });
  if(skuInfo && skuInfo.n03_name)columns.push({ field: 'n03_name', headerName: skuInfo.t_n03_name, width: 130 });
  if(skuInfo && skuInfo.n04_name)columns.push({ field: 'n04_name', headerName: skuInfo.t_n04_name, width: 130 });
  if(skuInfo && skuInfo.n05_name)columns.push({ field: 'n05_name', headerName: skuInfo.t_n05_name, width: 130 });
  return columns;
};

const list_content = (stateSet) => {

  const {st_goodsList, o_rowNum, setRowNum, open, setOpen, d_skuId, setDSkuId} = stateSet;
  
  
  const i_rowNum      = o_rowNum.num;
  const is_error      = o_rowNum.error;

  const _DISP_MIN     = 1;
  const _DISP_MAX     = 100;
  const row_height    = 36;
  const footer_height = 100;
  const _LIST_HEIGHT  = (i_rowNum * row_height) + footer_height;

  const openDetailDialog = (sku_id) => {
    setDSkuId(sku_id);
    setOpen(true);
  }


  const is_rowNumOK = (rowNum)    => (_DISP_MIN <= rowNum && rowNum <= _DISP_MAX);

  const onChange = (event) => {
    const input = Number(event.target.value);
    if(is_rowNumOK(input)) setRowNum({num: input   , error: false});
    else                     setRowNum({num: i_rowNum, error: true});
  }

  const status_rowNum = (! is_error)?{error: false, helperText: ''}: {error: true, helperText: `Input, ${_DISP_MIN} ～ ${_DISP_MAX}.`};

  const dg_columns = get_dgColumns(st_goodsList[0]);

  return (
    <>
      <Title>生地リスト</Title>

      <DETAIL fromParent={{open, setOpen, d_skuId}} />

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
          getRowId={(row) => `${row.sku_id}`}
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
  const [o_rowNum    , setRowNum    ] = useState({num:20, error: false});

  const [open        , setOpen      ] = useState(false);
  const [d_skuId     , setDSkuId    ] = useState(null);

  const {commonFunc} = useContext(CTX_USER);

  const stateSet = {st_goodsList, o_rowNum, setRowNum, open, setOpen, d_skuId, setDSkuId};

  return (
    <DisplayFrame>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}} >
            {search_content(setGoodsList, commonFunc)}
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
