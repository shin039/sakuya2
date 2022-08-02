// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useEffect, useState } from 'react';

import {
   Box
  ,Button
  ,Modal
  ,Table
  ,TableBody
  ,TableCell
  ,TableContainer
  ,TableRow
  ,Paper
  ,Grid
  ,IconButton
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

// Proprietary 
import util     from 'common/util';
import {apiGet} from 'api'
import Title    from 'component/Title';

// -----------------------------------------------------------------------------
// Style
// -----------------------------------------------------------------------------
const style = {
  position : 'absolute',
  top      : '50%',
  left     : '50%',
  transform: 'translate(-50%, -50%)',
  width    : '90%',
  height   : '90%',
  bgcolor  : 'background.paper',
  border   : '2px solid #000',
  boxShadow: 24,
  p        : 4,
  overflow : 'scroll',
};

const style_th      = { bgcolor: 'primary.main'  , color: 'primary.contrastText' }
const style_th_sku  = { bgcolor: 'primary.main'  , color: 'primary.contrastText' }
const style_th_ext  = { bgcolor: 'secondary.main', color: 'primary.contrastText' }
const style_td      = { bgcolor: 'label.main'    , color: 'label.mainText'       }

const style_td_odd        = { bgcolor: 'label.odd'     , color: 'label.mainText'     }
const style_td_even       = { bgcolor: 'label.even'    , color: 'label.mainText'     }
const style_td_odd_row2   = { bgcolor: 'label_sub.odd' , color: 'label_sub.mainText' }
const style_td_even_row2  = { bgcolor: 'label_sub.even', color: 'label_sub.mainText' }
const style_td_multi_odd  = { rowOne: style_td_odd , rowTwo: style_td_odd_row2  }
const style_td_multi_even = { rowOne: style_td_even, rowTwo: style_td_even_row2 }

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
export default function BasicModal(props) {
  const [st_goodsList   , setGoodsInfo    ] = useState([{}]);
  const [st_discountList, setDiscountInfo ] = useState([{}]);
  const [st_materialList, setMaterialInfo ] = useState([{}]);

  const {open, setOpen} = props.fromParent;
  const {d_goodsId}     = props.fromParent;

  const handleClose = () => setOpen(false);

  // d_goodsIdに変化があったときに実行
  useEffect(() => {
    if(! d_goodsId) return;
    const f_success_sku = response => setGoodsInfo((response && response.data && response.data.result) || {});
    apiGet({url: `goods/${d_goodsId}`, f_success: f_success_sku});

    const f_success_discount = response => setDiscountInfo((response && response.data && response.data.result) || {});
    apiGet({url: `discount/goods/${d_goodsId}`, f_success: f_success_discount});

    const f_success_material = response => setMaterialInfo((response && response.data && response.data.result) || {});
    apiGet({url: `material/goods/${d_goodsId}`, f_success: f_success_material});

  }, [d_goodsId]);

  // 長いから省略のため。
  const gList = st_goodsList;
  const gInfo = gList[0];
  const dList = st_discountList;
  const dInfo = dList[0];
  const mList = st_materialList;

  const main_columns = [
    //{label: 'category', value: gInfo.category     },
    //{label: 'goods_id', value: gInfo.goods_id     },
    //{label: 'maker_id', value: gInfo.maker_id     },
    {label: '商品名'    , value: gInfo.name         },
    {label: 'カテゴリ'  , value: gInfo.category_name},
    {label: 'メーカー'  , value: gInfo.maker_name   },
    {label: '登録者'    , value: gInfo.regist_staff },
    {label: '登録日時'  , value: gInfo.regist_time  },
    {label: '更新者'    , value: gInfo.update_staff },
    {label: '更新日時'  , value: gInfo.update_time  },
    {label: '削除済'    , value: gInfo.is_delete    },
  ];

  const get_skuColumns = (skuInfo) => [
    {label: skuInfo.t_t01_name, value: skuInfo.t01_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_t02_name, value: skuInfo.t02_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_t03_name, value: skuInfo.t03_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_t04_name, value: skuInfo.t04_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_t05_name, value: skuInfo.t05_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_i01_name, value: skuInfo.i01_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_i02_name, value: skuInfo.i02_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_i03_name, value: skuInfo.i03_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_i04_name, value: skuInfo.i04_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_i05_name, value: skuInfo.i05_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_n01_name, value: skuInfo.n01_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_n02_name, value: skuInfo.n02_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_n03_name, value: skuInfo.n03_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_n04_name, value: skuInfo.n04_name                  , headerCol: style_th_ext},
    {label: skuInfo.t_n05_name, value: skuInfo.n05_name                  , headerCol: style_th_ext},
    {label: 'JAN'             , value: skuInfo.jan                       , headerCol: style_th_sku},
    {label: '型番'            , value: skuInfo.model_no                  , headerCol: style_th_sku},
    {label: '仕入値'          , value: util.formatYen(skuInfo.unit_cost) , headerCol: style_th_sku},
    {label: '卸売価格 (税抜)' , value: util.formatYen(skuInfo.ws_price)  , headerCol: style_th_sku},
    {label: '小売価格 (税抜)' , value: util.formatYen(skuInfo.rt_price)  , headerCol: style_th_sku},
    {label: '税率'            , value: skuInfo.tax_rate                  , headerCol: style_th_sku},
  ];

  const get_discountColumns = (discInfo) => [
    {label: '会社名'           , value: discInfo.company_name            , headerCol: style_th_sku},
    // {label: 'SKU ID'           , value: discInfo.sku_id                  , headerCol: style_th_sku},
    {label: discInfo.t_t01_name, value: discInfo.t01_name                , headerCol: style_th_ext},
    {label: discInfo.t_t02_name, value: discInfo.t02_name                , headerCol: style_th_ext},
    {label: discInfo.t_t03_name, value: discInfo.t03_name                , headerCol: style_th_ext},
    {label: discInfo.t_t04_name, value: discInfo.t04_name                , headerCol: style_th_ext},
    {label: discInfo.t_t05_name, value: discInfo.t05_name                , headerCol: style_th_ext},
    {label: discInfo.t_i01_name, value: discInfo.i01_name                , headerCol: style_th_ext},
    {label: discInfo.t_i02_name, value: discInfo.i02_name                , headerCol: style_th_ext},
    {label: discInfo.t_i03_name, value: discInfo.i03_name                , headerCol: style_th_ext},
    {label: discInfo.t_i04_name, value: discInfo.i04_name                , headerCol: style_th_ext},
    {label: discInfo.t_i05_name, value: discInfo.i05_name                , headerCol: style_th_ext},
    {label: discInfo.t_n01_name, value: discInfo.n01_name                , headerCol: style_th_ext},
    {label: discInfo.t_n02_name, value: discInfo.n02_name                , headerCol: style_th_ext},
    {label: discInfo.t_n03_name, value: discInfo.n03_name                , headerCol: style_th_ext},
    {label: discInfo.t_n04_name, value: discInfo.n04_name                , headerCol: style_th_ext},
    {label: discInfo.t_n05_name, value: discInfo.n05_name                , headerCol: style_th_ext},
    {label: 'JAN'              , value: discInfo.jan                     , headerCol: style_th_sku},
    {label: '卸売価格 (税抜)'  , value: util.formatYen(discInfo.ws_price), headerCol: style_th_sku},
    {label: '小売価格 (税抜)'  , value: util.formatYen(discInfo.rt_price), headerCol: style_th_sku},
    {label: '税率'             , value: discInfo.tax_rate                , headerCol: style_th_sku},
  ];

  const get_materialColumns = (mateInfo) => [
    {label: mateInfo.t_t01_name, value: mateInfo.t01_name          , headerCol: style_th_ext},
    {label: mateInfo.t_t02_name, value: mateInfo.t02_name          , headerCol: style_th_ext},
    {label: mateInfo.t_t03_name, value: mateInfo.t03_name          , headerCol: style_th_ext},
    {label: mateInfo.t_t04_name, value: mateInfo.t04_name          , headerCol: style_th_ext},
    {label: mateInfo.t_t05_name, value: mateInfo.t05_name          , headerCol: style_th_ext},
    {label: mateInfo.t_i01_name, value: mateInfo.i01_name          , headerCol: style_th_ext},
    {label: mateInfo.t_i02_name, value: mateInfo.i02_name          , headerCol: style_th_ext},
    {label: mateInfo.t_i03_name, value: mateInfo.i03_name          , headerCol: style_th_ext},
    {label: mateInfo.t_i04_name, value: mateInfo.i04_name          , headerCol: style_th_ext},
    {label: mateInfo.t_i05_name, value: mateInfo.i05_name          , headerCol: style_th_ext},
    {label: mateInfo.t_n01_name, value: mateInfo.n01_name          , headerCol: style_th_ext},
    {label: mateInfo.t_n02_name, value: mateInfo.n02_name          , headerCol: style_th_ext},
    {label: mateInfo.t_n03_name, value: mateInfo.n03_name          , headerCol: style_th_ext},
    {label: mateInfo.t_n04_name, value: mateInfo.n04_name          , headerCol: style_th_ext},
    {label: mateInfo.t_n05_name, value: mateInfo.n05_name          , headerCol: style_th_ext},

    //{label:'商品コード'        , value: mateInfo.goods_id          , headerCol: style_th_sku},
    {label:'材工区分'          , value: mateInfo.material_kind_name, headerCol: style_th_sku},
    {label:'素材種別'          , value: mateInfo.material_type_name, headerCol: style_th_sku},
    {label:'メーカー名'        , value: mateInfo.maker_name        , headerCol: style_th_sku},
    {label:'素材名'            , value: mateInfo.material_name     , headerCol: style_th_sku},
    {label:'用途'              , value: mateInfo.uses              , headerCol: style_th_sku},
    {label:'説明'              , value: mateInfo.discription       , headerCol: style_th_sku},
    {label:'仕入単価'          , value: mateInfo.unit_price        , headerCol: style_th_sku},
    {label:'単位'              , value: mateInfo.unit              , headerCol: style_th_sku},
    {label:'税率'              , value: mateInfo.tax               , headerCol: style_th_sku},
    //{label:'SKUコード'         , value: mateInfo.sku_id            , headerCol: style_th_sku},
  ];


  // 素材・工賃のSKU別表示を色分けするための変数 
  const _obj_multiColor = {
    no       : 0,
    evenOrOdd: 0,
    increment: no        => {_obj_multiColor.no = no; _obj_multiColor.evenOrOdd++;},
    getColor : (is_odd) => {
      const base_color = (is_odd)?style_td_multi_odd: style_td_multi_even;
      return (_obj_multiColor.evenOrOdd % 2 === 1)? base_color.rowOne: base_color.rowTwo;
    },
    init     : ()        => {_obj_multiColor.no = 0; _obj_multiColor.evenOrOdd = 0; return true;}
  };

  const mList_common        = mList.filter((discInfo) => discInfo.sku_id <= 0);
  const mList_sku           = mList.filter((discInfo) => discInfo.sku_id  > 0);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Modal
      open={open}
      //onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
          <Grid item><Title>商品詳細</Title></Grid>
          <Grid item><IconButton onClick={handleClose} color='secondary'><CloseIcon /></IconButton></Grid>
        </Grid>
        <br/>

        {/* ========================== Main ========================== */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>
            {main_columns.map((key, idx) => (
                <TableRow
                  key={`main_${idx}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={style_th}>{key.label}</TableCell>
                  <TableCell sx={style_td}>{key.value}</TableCell>
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ========================== SKU ========================== */}
        <Title style={{margin:'2em 0 0.5em 0'}}>SKU 詳細</Title>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>
            {/* Header */}
            <TableRow key={`sku_header`}>
              {get_skuColumns(gInfo).map((key, i) => (key.label)?( <TableCell  key={`sku_h_${i}`} sx={key.headerCol}>{key.label}</TableCell>): '')}
            </TableRow>

            {/* Content */}
            {gList.map((skuInfo, idx) => 
              <TableRow key={`sku_${idx}`}>
                {get_skuColumns(skuInfo).map((key, i) => (key.label)?( <TableCell key={`sku_c_${idx}_${i}`} sx={(idx%2===1)?style_td_even: style_td_odd}>{key.value}</TableCell>): '')}
              </TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ========================== Discount ========================== */}
        {dList && dList[0].sku_id && _obj_multiColor.init() && (
        <>
          <Title style={{margin:'2em 0 0.5em 0'}}>特別設定 一覧</Title>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
              <TableBody>
              {/* Header */}
              <TableRow>
                {get_discountColumns(dInfo).map((key, i) => (key.label)?( <TableCell key={`disc_h_${i}`} sx={key.headerCol}>{key.label}</TableCell>): '')}
              </TableRow>

              {/* Content */}
              {dList.map((discInfo, idx) => {
                // 会社毎に色分けする
                if(discInfo.company_name !== _obj_multiColor.no){
                  _obj_multiColor.increment(discInfo.company_name);
                }
                const color_td = _obj_multiColor.getColor(idx%2===1);

                return (<TableRow key={`disc_${idx}`}>
                  {get_discountColumns(discInfo).map((key, i) => 
                    (key.label)?( <TableCell key={`disc_c_${idx}_${i}`} sx={color_td}>{key.value}</TableCell>): '')}
                </TableRow>);
              })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
        )}

        {/* ========================== Material (Common) ========================== */}
        {mList && mList[0] && mList[0].goods_id && (
        <>
          <Title style={{margin:'2em 0 0.5em 0'}}>素材・工賃</Title>

          {mList_common && mList_common[0] &&
          <>
            <Title style={{margin:'0 0 0.5em 0'}}>共通</Title>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="simple table">
                <TableBody>
                {/* 共通項目を先にテーブル表示する。 */}
                {/* Header */}
                <TableRow key={`mate_c_h`}>
                  {get_materialColumns(mList_common[0]).map((key, i) => (key.label)?( <TableCell key={`mate_c_h_${i}`} sx={key.headerCol}>{key.label}</TableCell>): '')}
                </TableRow>
                {/* Content */}
                {mList_common.map((discInfo, idx) => 
                  (
                    <TableRow key={`mate_c_c_${idx}`}>
                      {get_materialColumns(discInfo).map((key, i) => (key.label)?( <TableCell key={`mate_c_c_${idx}_${i}`} sx={(idx%2===1)?style_td_even: style_td_odd}>{key.value}</TableCell>): '')}
                    </TableRow>
                  ))
                }
                </TableBody>
              </Table>
            </TableContainer>
          </>
          }

          {mList_sku && mList_sku[0] && _obj_multiColor.init() &&
          <>
            <Title style={{margin:'1em 0 0.5em 0'}}>SKU別</Title>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="simple table">
                <TableBody>
                {/* 共通項目を先にテーブル表示する。 */}
                {/* Header */}
                <TableRow key={`mate_f_h`}>
                  {get_materialColumns(mList_sku[0]).map((key, i) => (key.label)?( <TableCell key={`mate_f_h_${i}`} sx={key.headerCol}>{key.label}</TableCell>): '')}
                </TableRow>
                {/* Content */}
                {mList_sku.map((discInfo, idx) => {

                  // SKU毎に色分けする
                  if(discInfo.sku_id !== _obj_multiColor.no){
                    _obj_multiColor.increment(discInfo.sku_id);
                  }
                  const color_td = _obj_multiColor.getColor(idx%2===1);

                  return (
                    <TableRow key={`mate_f_c_${idx}`}>
                      {get_materialColumns(discInfo).map((key, i) => (key.label)?( <TableCell key={`mate_f_c_${idx}_${i}`} sx={color_td}>{key.value}</TableCell>): '')}
                    </TableRow>
                  )})
                }
                </TableBody>
              </Table>
            </TableContainer>
          </>
          }
        </>
        )}

        {/* ========================== Footer ========================== */}
        <br/>
        <Grid container direction='row' justifyContent='flex-end' alignItems='center' spacing={1}>
          <Grid item><Button variant='outlined' onClick={handleClose}>Close</Button></Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
