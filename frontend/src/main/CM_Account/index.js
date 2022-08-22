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
import {apiGet, apiPut}     from 'api'
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
const tf_template  = ({id, label, val, reg_valid, is_require, err_valid}, st_staff, setStaff) => {
  // Validation チェック
  const onChange = (event) => {
    const error   = st_staff.error;
    const val     = event.target.value;
    // 必須入力で入力がないか、入力があってバリデーションに引っかかるときはエラー。
    const isError = (! _chk_existValue(val) && is_require) || (_chk_existValue(val) && ! reg_valid.test(val))
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
  {label: 'ユーザID'  , id: 'userid'  , is_require: true , permit_blank: false, val: staff.userid   , template: lbl_template, reg_valid: REGEX_VALIDATION.min(1)    , err_valid: 'ユーザIDの値が不正です。'                          },
  {label: 'パスワード', id: 'passwd'  , is_require: false, permit_blank: false, val: staff.passwd   , template: tf_template , reg_valid: REGEX_VALIDATION.passwd(8) , err_valid: 'パスワードは8桁以上の英数記号で入力してください。' },
  {label: '名前'      , id: 'name'    , is_require: true , permit_blank: false, val: staff.name     , template: tf_template , reg_valid: REGEX_VALIDATION.max(50)   , err_valid: '名前は50文字以内で入力してください。'              },
  {label: '誕生日'    , id: 'birthday', is_require: false, permit_blank: true , val: staff.birthday , template: dp_template , reg_valid: REGEX_VALIDATION.yyyymmdd(), err_valid: '誕生日はYYYY/MM/DD形式で入力してください。'        },
  {label: 'TEL'       , id: 'tel'     , is_require: false, permit_blank: true , val: staff.tel      , template: tf_template , reg_valid: REGEX_VALIDATION.tel()     , err_valid: '電話番号の入力値が不正です。'                      },
  {label: 'E-MAIL'    , id: 'mail'    , is_require: false, permit_blank: true , val: staff.mail     , template: tf_template , reg_valid: REGEX_VALIDATION.email()   , err_valid: 'メールアドレスの入力値が不正です。'                },
  //{label: '権限'    , value: staff.authorith},
];

// -----------------------------------------------------------------------------
// Function
// -----------------------------------------------------------------------------
const handleSubmit = (event, userInfo, useEffectStop, commonFunc) => {
  event.preventDefault();
  const data      = new FormData(event.currentTarget);
  const form_info = get_form_info({});

  const form_values = {};
  let   is_error    = false;

  form_info.forEach((record) => {
    const { id, is_require, permit_blank, reg_valid } = record;
    const val = data.get(id);

    // 登録前にバリデーションチェック
    if(_chk_existValue(val)){
      if(reg_valid.test(val)) form_values[id] = val;
      else                    is_error = true;
    }
    else {
      if(is_require) is_error = true;
      else {
        // 空白入力の時
        if(permit_blank) form_values[id] = val;
      }
    }
  })

  // エラーが解消されていない
  if(is_error){
    useEffectStop.current = true;
    commonFunc.snackbar.error("入力値にエラーがあります。");
    return;
  }

  // 登録処理
  const f_success = response => commonFunc.snackbar.info("更新が完了しました。");
  apiPut({url: `staff/${userInfo.userid}`, o_params: form_values, f_success, commonFunc});
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
  const {userInfo, useEffectStop, commonFunc} = useContext(CTX_USER);


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
      apiGet({url: `staff/${userInfo.userid}`, f_success: f_success_staff, commonFunc});
    }
    else useEffectStop.current = false;
  }, [userInfo, useEffectStop, commonFunc]);


  // Render
  return (
    <DisplayFrame>
      <Title>アカウント情報</Title>
      {/* ========================== Main ========================== */}
      <Box component="form" onSubmit={event => handleSubmit(event, userInfo, useEffectStop, commonFunc)} noValidate sx={{ mt: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>

            {form_info.map((record, idx) => (
                <TableRow
                  key={`main_${idx}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={style_th}>{record.label}</TableCell>
                  <TableCell sx={style_td}>{record.template(record, st_staff, setStaff)}</TableCell>
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
