import {useCookies} from 'react-cookie';
import axios        from 'axios';
import log          from 'common/log';

// -----------------------------------------------------------------------------
// Common Settings
// -----------------------------------------------------------------------------
const _API_HOST = process.env.REACT_APP_API_URL
const _DF_F_SUC = response => {log.debug(response)}
const _DF_F_ERR = response => {
  const response_err = (response.response && response.response.data && response.response.data.message) || null;
  const err_msg      = response_err || response;
  log.error(err_msg)
}

const _COMMON_F_ERR = (response, default_func) => {
  // ログイン NGの場合に処理を行う。
  const result = (response.response && response.response.data && response.response.data.rsult) || null;
  if(result === 'Login_NG'){
    // TODO remove Cookie... and redirect Login page. 
  }

  // 既存のエラー処理を実行する。
  default_func(response);
}

// -----------------------------------------------------------------------------
// API: Get Request
// -----------------------------------------------------------------------------
export const apiGet = ({url, o_params={}, f_success=_DF_F_SUC ,f_error=_DF_F_ERR}) => {

  // Make URL Parameter
  const makeParamStr = (obj) => {
    let rtnval='?';
    for(let key in obj) rtnval += `${key}=${obj[key]}&`;
    return (Object.keys(obj).length > 0)? rtnval: '';
  }

  const query_str = makeParamStr(o_params);
  const api_url   = `${_API_HOST}/${url}${query_str}`;

  axios.get(api_url, {withCredentials: true})
   .then ( response => f_success(response) )
   .catch( response => f_error  (response) )
}

// -----------------------------------------------------------------------------
// API: Post Request
// -----------------------------------------------------------------------------
export const apiPost = ({url, o_params={}, f_success=_DF_F_SUC ,f_error=_DF_F_ERR}) => {
  const api_url  = `${_API_HOST}/${url}`;

  axios.post(api_url, o_params, {withCredentials: true})
   .then ( response => f_success(response) )
   .catch( response => f_error  (response) )

}
