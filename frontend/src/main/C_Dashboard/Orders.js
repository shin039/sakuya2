import { useEffect, useState } from 'react';
import Link       from '@mui/material/Link';
import Table      from '@mui/material/Table';
import TableBody  from '@mui/material/TableBody';
import TableCell  from '@mui/material/TableCell';
import TableHead  from '@mui/material/TableHead';
import TableRow   from '@mui/material/TableRow';

import Title      from 'component/Title';

// Context
import { useContext }  from 'react';
import { CTX_USER }    from 'main/route_factory';

import {apiGet}  from 'api'


function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {

  const [st_goodsList, setGoodsList] = useState([]);
  const {commonFunc} = useContext(CTX_USER);

  // マウント時に実行
  useEffect(() => {
    const f_success = response => setGoodsList((response && response.data && response.data.result) || []);
    apiGet({url: 'goods', o_params: {limit: 5}, f_success, commonFunc});
  }, [commonFunc]);

  return (
    <>
      <Title>Goods Info</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>JAN</TableCell>
            <TableCell>Tax Rate</TableCell>
            <TableCell>Maker</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {st_goodsList.map((record) => (
            <TableRow key={record.jan}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.jan}</TableCell>
              <TableCell>{record.tax_rate}</TableCell>
              <TableCell>{record.maker_id}</TableCell>
              <TableCell align="right">{`￥${record.rt_price}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </>
  );
}
