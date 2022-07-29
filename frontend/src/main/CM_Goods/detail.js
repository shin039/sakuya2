// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useEffect, useState } from 'react';

import {
   Box
  ,Button
  ,Typography
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

const style_th     = { bgcolor: '#efefef' }
const style_th_sku = { bgcolor: '#efefef' }
const style_th_ext = { bgcolor: '#ffcc80' }
const style_td     = { bgcolor: '#FFF' }

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
export default function BasicModal(props) {
  const [st_goodsList   , setGoodsInfo    ] = useState([{}]);
  const [st_discountList, setDiscountInfo ] = useState([{}]);

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

  }, [d_goodsId]);

  // 長いから省略のため。
  const gList = st_goodsList;
  const gInfo = gList[0];
  const dList = st_discountList;
  const dInfo = dList[0];

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

  const get_variationColumns = (skuInfo) => [
    {label: 'JAN'            , value: skuInfo.jan      },
    {label: '型番'           , value: skuInfo.model_no },
    {label: '仕入値'         , value: util.formatYen(skuInfo.unit_cost)},
    {label: '卸売価格 (税抜)', value: util.formatYen(skuInfo.ws_price) },
    {label: '小売価格 (税抜)', value: util.formatYen(skuInfo.rt_price) },
    {label: '税率'           , value: skuInfo.tax_rate },
  ];

  const get_extColumns = (skuInfo) => [
    {label: skuInfo.t_t01_name , value: skuInfo.t01_name},
    {label: skuInfo.t_t02_name , value: skuInfo.t02_name},
    {label: skuInfo.t_t03_name , value: skuInfo.t03_name},
    {label: skuInfo.t_t04_name , value: skuInfo.t04_name},
    {label: skuInfo.t_t05_name , value: skuInfo.t05_name},
    {label: skuInfo.t_i01_name , value: skuInfo.i01_name},
    {label: skuInfo.t_i02_name , value: skuInfo.i02_name},
    {label: skuInfo.t_i03_name , value: skuInfo.i03_name},
    {label: skuInfo.t_i04_name , value: skuInfo.i04_name},
    {label: skuInfo.t_i05_name , value: skuInfo.i05_name},
    {label: skuInfo.t_n01_name , value: skuInfo.n01_name},
    {label: skuInfo.t_n02_name , value: skuInfo.n02_name},
    {label: skuInfo.t_n03_name , value: skuInfo.n03_name},
    {label: skuInfo.t_n04_name , value: skuInfo.n04_name},
    {label: skuInfo.t_n05_name , value: skuInfo.n05_name},
  ];

  const get_discountColumns = (discInfo) => [
    {label: '会社名'         , value: discInfo.company_name            },
    {label: 'SKU ID'         , value: discInfo.sku_id                  },
    {label: 'JAN'            , value: discInfo.jan                     },
    {label: '卸売価格 (税抜)', value: util.formatYen(discInfo.ws_price)},
    {label: '小売価格 (税抜)', value: util.formatYen(discInfo.rt_price)},
    {label: '税率'           , value: discInfo.tax_rate                },
  ];

  return (
    <Modal
      open={open}
      //onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
          <Grid item><Typography id="modal-modal-title" variant="h6" component="h2">商品詳細</Typography></Grid>
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
        <Typography variant="h6" component="h2" style={{margin:'2em 0 0.5em 0'}}>バリエーション詳細</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>
            {/* Header */}
            <TableRow key={`sku_header`}>
              {get_extColumns(gInfo).map      ((key, i) => key.label?( <TableCell key={`sku_he_${i}`} sx={style_th_ext}>{key.label}</TableCell>): '')}
              {get_variationColumns(gInfo).map((key, i) => ( <TableCell  key={`sku_hs_${i}`} sx={style_th_sku}>{key.label}</TableCell>))}
            </TableRow>

            {/* Content */}
            {gList.map((skuInfo, idx) => 
              <TableRow key={`sku_${idx}`}>
                {get_extColumns(skuInfo).map      ((key, i) => key.label?( <TableCell key={`sku_ce_${idx}_${i}`} sx={style_td}>{key.value}</TableCell>): '')}
                {get_variationColumns(skuInfo).map((key, i) => ( <TableCell key={`sku_cs_${idx}_${i}`} sx={style_td}>{key.value}</TableCell>))}
              </TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ========================== Discount ========================== */}
        {dList[0].sku_id && (
        <>
          <Typography variant="h6" component="h2" style={{margin:'2em 0 0.5em 0'}}>特別設定 一覧</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
              <TableBody>
              {/* Header */}
              <TableRow>
                {get_discountColumns(dInfo).map((key, i) => ( <TableCell key={`disc_h_${i}`} sx={style_th_sku}>{key.label}</TableCell>))}
              </TableRow>

              {/* Content */}
              {dList.map((discInfo, idx) => 
                <TableRow key={`disc_${idx}`}>
                  {get_discountColumns(discInfo).map((key, i) => ( <TableCell key={`disc_c_${idx}_${i}`} sx={style_td}>{key.value}</TableCell>))}
                </TableRow>
              )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
        )}

        {/* ========================== Material ========================== */}
        <Typography variant="h6" component="h2" style={{margin:'2em 0 0.5em 0'}}>素材詳細</Typography>

        {/* ========================== Footer ========================== */}
        <br/>
        <Grid container direction='row' justifyContent='flex-end' alignItems='center' spacing={1}>
          <Grid item><Button variant='outlined' onClick={handleClose}>Close</Button></Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
