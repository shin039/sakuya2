//import {useCookies} from 'react-cookie';
import axios        from 'axios';
import log          from 'common/log';

// -----------------------------------------------------------------------------
// Common Settings
// -----------------------------------------------------------------------------

const _NODE_ENV = process.env.NODE_ENV;
const _API_HOST = (_NODE_ENV === 'production')? process.env.REACT_APP_PRD_API_URL: process.env.REACT_APP_API_URL;

const _DF_F_SUC = response => {log.debug(response)}
const _DF_F_ERR = (response, logout) => {

  const obj_response = response.response || null;

  if(obj_response){

    const {
      /*ソフトウェア的にこちらで実装しているエラー。*/ 
      result, message,
      /* flaskからのエラー*/
      msg, status
    } = obj_response.data || {};
  
    // Soft Ware Error
    if(result){
      if( result === 'Login_NG') log.info(`ログインに失敗しました: ${message}`);
      else                       log.error(`想定外のソフトウェアエラー: (${result}) ${message}`)
      return;
    }
    
    // Middle Ware Error
    if(status === 401){
      log.info(`タイムアウトしました。ログインしなおしてください。: ${msg}`);
      logout();
    }
    else log.error(`想定外のミドルウェアエラー: (${status}) ${msg}`)
    return;
  }

  log.error('想定外のエラーが発生しました。')
  log.error(response)
}

// -----------------------------------------------------------------------------
// API: Get Request
// -----------------------------------------------------------------------------
export const apiGet = ({url, o_params={}, f_success=_DF_F_SUC ,f_error, f_logout= () => {}}) => {

  if(! f_error) f_error = (res) => _DF_F_ERR(res, f_logout);

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
export const apiPost = ({url, o_params={}, f_success=_DF_F_SUC ,f_error, f_logout= () => {}}) => {
  const api_url  = `${_API_HOST}/${url}`;

  if(! f_error) f_error = (res) => _DF_F_ERR(res, f_logout);

  axios.post(api_url, o_params, {withCredentials: true})
   .then ( response => f_success(response) )
   .catch( response => f_error  (response) )

}
