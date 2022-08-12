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
import {apiGet, apiPost}    from 'api'
import DisplayFrame         from 'component/DisplayFrame/SinglePanel';
import Title                from 'component/Title';
import DatePicker           from 'component/DatePicker';
import { REGEX_VALIDATION } from 'common/const'

// Context
import { useContext }  from 'react';
import { CTX_USER }    from 'main/route_factory';

const style_th = { bgcolor: 'primary.main'  , color: 'primary.contrastText' }
const style_td = { bgcolor: 'label.main'    , color: 'label.mainText'       }

const _chk_existValue = (val) => val !== undefined && val !== null && val !== '';

// -----------------------------------------------------------------------------
// Form Info
// -----------------------------------------------------------------------------
// 画面コンポーネント
const lbl_template = ({id, label, val}) => (<> {val} <input type="hidden" id={id} name={id} value={val || ''} /> </>);
const tf_template  = ({id, label, val, reg_valid, err_valid}, st_staff, setStaff) => {
  // Validation チェック
  const onChange = (event) => {
    const error   = st_staff.error;
    const val     = event.target.value;
    const isError = (_chk_existValue(val) && ! reg_valid.test(val))
    error[id]     = isError;

    setStaff({...st_staff, [id]: val, error})
  }

  const is_error   = st_staff.error[id];
  const helperText = (is_error)? err_valid: '';

  return (
    <FormControl sx={{minWidth: 150}}>
      <TextField id={id} label={label} name={id} variant="outlined" onChange={onChange} value={val || ''} sx={{bgcolor:'background.paper'}} error={is_error} helperText={helperText} />
    </FormControl>
  );
}

const dp_template  = ({id, label, val, err_valid}) => {

  return (
    <FormControl sx={{minWidth: 150}}>
      <DatePicker sx={{width: 223, bgcolor:'background.paper'}} id={id} name={id} label={label} init_val={val} err_msg={err_valid} /> 
    </FormControl>
  );
}

const get_form_info = (staff) => [
  {label: 'ユーザID'  , id: 'userid'  , is_require: true , val: staff.userid   , template: lbl_template, reg_valid: REGEX_VALIDATION.min(1)    , err_valid: 'ユーザIDの値が不正です。'                          },
  {label: 'パスワード', id: 'passwd'  , is_require: false, val: staff.passwd   , template: tf_template , reg_valid: REGEX_VALIDATION.passwd(8) , err_valid: 'パスワードは8桁以上の英数記号で入力してください。' },
  {label: '名前'      , id: 'name'    , is_require: false, val: staff.name     , template: tf_template , reg_valid: REGEX_VALIDATION.max(50)   , err_valid: '名前は50文字以内で入力してください。'              },
  {label: '誕生日'    , id: 'birthday', is_require: false, val: staff.birthday , template: dp_template , reg_valid: REGEX_VALIDATION.yyyymmdd(), err_valid: '誕生日はYYYY/MM/DD形式で入力してください。'        },
  {label: 'TEL'       , id: 'tel'     , is_require: false, val: staff.tel      , template: tf_template , reg_valid: REGEX_VALIDATION.tel()     , err_valid: '電話番号の入力値が不正です。'                      },
  {label: 'E-MAIL'    , id: 'mail'    , is_require: false, val: staff.mail     , template: tf_template , reg_valid: REGEX_VALIDATION.email()   , err_valid: 'メールアドレスの入力値が不正です。'                },
  //{label: '権限'    , value: staff.authorith},
];


// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const handleSubmit = (event, userInfo, useEffectStop, setSnackbar, f_logout) => {
  event.preventDefault();
  const data      = new FormData(event.currentTarget);
  const form_info = get_form_info({});

  const form_values = {};
  let   is_error    = false;

  form_info.map((record) => {
    const { id, is_require, reg_valid } = record;
    const val            = data.get(id);

    if(is_require || _chk_existValue(val)){
      if(reg_valid.test(val)) form_values[id] = val;
      else                    is_error = true;
    }

    return id; // mapを使っているので入れてるだけ。ロジックには関係ない。
  })

  // エラーが解消されていない
  if(is_error){
    useEffectStop.current = true;
    setSnackbar({open:true, message: "入力値にエラーがあります。", severity: "error", is_useEffect: false});
    return;
  }


  // TODO 登録処理
  console.log(`# 登録処理 画面更新停止 ${useEffectStop.current}`)
  console.dir(form_values)
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
  const [st_staff, setStaff] = useState({error:{}});
  // Contextから値の取得
  const {userInfo, useEffectStop, setSnackbar, f_logout} = useContext(CTX_USER);

  const form_info = get_form_info(st_staff);

  // マウント時に実行
  useEffect(() => {
    if(! useEffectStop.current){
      // 検索条件のセレクトボックスに使うデータを取得する
      const chk_val         = val      => (Array.isArray(val) && val.length > 0)? val[0]: {};
      const f_success_staff = response => {
        const staff_info    = chk_val((response && response.data && response.data.result) || []);
        // errorメッセージ専用のオブジェクトを設定。
        staff_info.error = {};
        // パスワードの初期表示はクリアする。
        staff_info.passwd = '';
        setStaff(staff_info);
      }
      apiGet({url: `staff/${userInfo.userid}`, f_success: f_success_staff, f_logout});
    }
    else useEffectStop.current = false;
  }, [userInfo, useEffectStop, f_logout]);


  // Render
  return (
    <DisplayFrame>
      <Title>アカウント情報</Title>
      {/* ========================== Main ========================== */}
      <Box component="form" onSubmit={event => handleSubmit(event, userInfo, useEffectStop, setSnackbar, f_logout)} noValidate sx={{ mt: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>

            {form_info.map((key, idx) => (
                <TableRow
                  key={`main_${idx}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={style_th}>{key.label}</TableCell>
                  <TableCell sx={style_td}>{key.template(key, st_staff, setStaff)}</TableCell>
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
