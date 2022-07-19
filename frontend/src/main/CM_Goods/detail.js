// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useEffect, useState } from 'react';

import Box        from '@mui/material/Box';
import Button     from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal      from '@mui/material/Modal';

import Table          from '@mui/material/Table';
import TableBody      from '@mui/material/TableBody';
import TableCell      from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow       from '@mui/material/TableRow';
import Paper          from '@mui/material/Paper';

import {apiGet}     from 'api'



// -----------------------------------------------------------------------------
// Style
// -----------------------------------------------------------------------------
const style = {
  position : 'absolute',
  top      : '50%',
  left     : '50%',
  transform: 'translate(-50%, -50%)',
  width    : '90%',
  bgcolor  : 'background.paper',
  border   : '2px solid #000',
  boxShadow: 24,
  p        : 4,
};

const style_th     = { bgcolor: '#efefef' }
const style_th_ext = { bgcolor: '#aaaaef' }
const style_td     = { bgcolor: '#FFF' }

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
export default function BasicModal(props) {
  const [st_goodsInfo, setGoodsInfo ] = useState({});

  const {open, setOpen} = props.fromParent;
  const {d_goodsId}     = props.fromParent;

  const handleClose = () => setOpen(false);

  // d_goodsIdに変化があったときに実行
  useEffect(() => {
    if(! d_goodsId) return;
    const f_success_cat = response => setGoodsInfo((response && response.data && response.data.result[0]) || {});
    apiGet({url: `goods/${d_goodsId}`, f_success: f_success_cat});
  }, [d_goodsId]);

  // 長いから省略のため。
  const gInfo = st_goodsInfo;
  const main_columns = [
    //{label: 'category', value: gInfo.category      },
    {label: '商品名'    , value: gInfo.name          },
    {label: 'カテゴリ'  , value: gInfo.category_name },
    //{label: 'goods_id', value: gInfo.goods_id      },
    {label: 'JAN'       , value: gInfo.jan           },
    //{label: 'maker_id', value: gInfo.maker_id      },
    {label: 'メーカー'  , value: gInfo.maker_name    },
    {label: '型番'      , value: gInfo.model_no      },
    {label: '仕入値'    , value: gInfo.unit_cost     },
    {label: '卸売価格'  , value: gInfo.ws_price      },
    {label: '小売価格'  , value: gInfo.rt_price      },
    {label: '税率'      , value: gInfo.tax_rate      },
    {label: '登録者'    , value: gInfo.regist_staff  },
    {label: '登録日時'  , value: gInfo.regist_time   },
    {label: '更新者'    , value: gInfo.update_staff  },
    {label: '更新日時'  , value: gInfo.update_time   },
    {label: '削除済'    , value: gInfo.is_delete     },
  ];

  const ext_columns = [
    {label: gInfo.t_i01_name , value: gInfo.i01_name    },
    {label: gInfo.t_i02_name , value: gInfo.i02_name    },
    {label: gInfo.t_i03_name , value: gInfo.i03_name    },
    {label: gInfo.t_i04_name , value: gInfo.i04_name    },
    {label: gInfo.t_i05_name , value: gInfo.i05_name    },
    {label: gInfo.t_t01_name , value: gInfo.t01_name    },
    {label: gInfo.t_t02_name , value: gInfo.t02_name    },
    {label: gInfo.t_t03_name , value: gInfo.t03_name    },
    {label: gInfo.t_t04_name , value: gInfo.t04_name    },
    {label: gInfo.t_t05_name , value: gInfo.t05_name    },
    {label: gInfo.t_n01_name , value: gInfo.n01_name    },
    {label: gInfo.t_n02_name , value: gInfo.n02_name    },
    {label: gInfo.t_n03_name , value: gInfo.n03_name    },
    {label: gInfo.t_n04_name , value: gInfo.n04_name    },
    {label: gInfo.t_n05_name , value: gInfo.n05_name    },
  ]


  return (
    <Modal
      open={open}
      //onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">商品詳細</Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>
            {/* Main */}
            {main_columns.map((key, idx) => (
                <TableRow
                  key={`main_${idx}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={style_th}>{key.label}</TableCell>
                  <TableCell sx={style_td}>{key.value}</TableCell>
                </TableRow>
            ))}
            {/* Ext */}
            {ext_columns.map((key, idx) => {
              const {label, value} = key;
              return label && (
                <TableRow
                  key={`ext_${idx}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={style_th_ext}>{label}</TableCell>
                  <TableCell sx={style_td}>{value}</TableCell>
                </TableRow>
              )}
            )}
            </TableBody>
          </Table>
        </TableContainer>

        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
}
