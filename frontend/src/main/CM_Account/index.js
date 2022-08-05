// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
// React
import { useEffect, useState } from 'react';

// Material UI
import {
   Box
  ,Button
  ,Table
  ,TableBody
  ,TableCell
  ,TableContainer
  ,TableRow
  ,Paper
  ,TextField
  ,FormControl
} from '@mui/material';

// Proprietary 
import {apiGet, apiPost} from 'api'
import DisplayFrame      from 'component/DisplayFrame/SinglePanel';
import Title             from 'component/Title';

// Context
import { useContext }  from 'react';
import { CTX_USER }    from 'main/route_factory';

const style_th = { bgcolor: 'primary.main'  , color: 'primary.contrastText' }
const style_td = { bgcolor: 'label.main'    , color: 'label.mainText'       }


// -----------------------------------------------------------------------------
// Form Info
// -----------------------------------------------------------------------------
const get_form_info = (staff) => [
  {label: 'ユーザID'  , id: 'userid'  , val: staff.userid   , is_edit: false, valid: false                                                    /* 入力がないのでチェック無し*/ },
  {label: 'パスワード', id: 'passwd'  , val: ''             , is_edit: true , valid: /^[\x01-\x7E]{8,}$/g                                     /*英数半角記号で8文字以上*/ },
  {label: '名前'      , id: 'name'    , val: staff.name     , is_edit: true , valid: /^.{0,50}$/g                                             /*50文字以内*/},
  {label: '誕生日'    , id: 'birthday', val: staff.birthday , is_edit: true , valid: /^[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/g /* YYYY/MM/DD */},
  {label: 'TEL'       , id: 'tel'     , val: staff.tel      , is_edit: true , valid: /^(0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1})[-)]?\d{4})|(0[5789]0[-(]?\d{4}[-)]?\d{4})$/ /*市外局番ありと携帯*/ },
  {label: 'E-MAIL'    , id: 'mail'    , val: staff.mail     , is_edit: true , valid: 'E-MAIL'}, /* TODO pattern.test(value)*/
  //{label: '権限'    , value: staff.authorith},
];


// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const handleSubmit = (event, f_logout) => {
  event.preventDefault();
  const data       = new FormData(event.currentTarget);

  const userid   = data.get('userid');
  const passwd   = data.get('passwd');
  const name     = data.get('name');
  const birthday = data.get('birthday');
  const tel      = data.get('tel');
  const mail     = data.get('mail');

  // DEBUG
  console.dir(userid);
  console.dir(passwd);
  console.dir(name);
  console.dir(birthday);
  console.dir(tel);
  console.dir(mail);

  // TODO 登録処理
  return ;
  //const f_success = response => setGlist((response && response.data && response.data.result) || []);
  //apiPost({url: 'staff', o_params: {limit: 1000, goods_name, category, maker, not_sku}, f_success, f_logout});
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Main
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const AccountInfo = () => {

  // ---------------------------------------------------------------------------
  // 定数・変数定義
  // ---------------------------------------------------------------------------
  // State 定義
  const [st_staff, setStaff]  = useState([{}]);
  // Contextから値の取得
  const {userInfo, f_logout} = useContext(CTX_USER);

  const form_info = get_form_info(st_staff[0]);

  // マウント時に実行
  useEffect(() => {
    // 検索条件のセレクトボックスに使うデータを取得する
    const f_success_staff = response => setStaff((response && response.data && response.data.result) || []);
    apiGet({url: `staff/${userInfo.userid}`, f_success: f_success_staff, f_logout});
  }, [userInfo, f_logout]);

  const tf_template = ({id, label, val, is_edit}) => (
    (is_edit)?
      <FormControl sx={{minWidth: 150}}>
        <TextField id={id} label={label} name={id} variant="outlined" value={val || ''} sx={{bgcolor:'background.paper'}} error={false} />
      </FormControl>
    :
      <> {val} <input type="hidden" id={id} name={id} value={val || ''} /> </>
  );

  return (
    <DisplayFrame>
      <Title>アカウント情報</Title>
      {/* ========================== Main ========================== */}
      <Box component="form" onSubmit={event => handleSubmit(event, f_logout)} noValidate sx={{ mt: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>
            {form_info.map((key, idx) => (
                <TableRow
                  key={`main_${idx}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={style_th}>{key.label}</TableCell>
                  <TableCell sx={style_td}>{tf_template(key)}</TableCell>
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >登　録</Button>
      </Box>
    </DisplayFrame>
  );
}

export default AccountInfo;
