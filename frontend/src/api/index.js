import axios        from 'axios';
import log          from 'common/log';

// -----------------------------------------------------------------------------
// Common Settings
// -----------------------------------------------------------------------------
const _CSRF_TOKEN_NAME = 'csrf_access_token';

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
    else {
      log.error(`想定外のミドルウェアエラー: (${status}) ${msg}`)
      log.error(response)
    }
    return;
  }

  log.error('想定外のエラーが発生しました。')
  log.error(response)
}

// Cookieの値を取得して返す。
//   -> useCookieを使わないのは、CSRFなどのリクエスト毎に値が変わる物は、
//      画面レンダリング完了後にリクエストが発生した場合、Cookieの値は変わるが、
//      useCookieで保持した値は旧いままになっているため、
//      documentオブジェクトからcookieの値を参照するようにしている。
const getCookie = (name) => {
  if(! document) return null;

  const cookie_list = (document.cookie.split(";")).reduce((arr_rslt, record) => {
    const [key, value] = record.split("=");
    return {...arr_rslt ,[key.trim()]: value};
  }, {});

  return cookie_list[name];

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
// API: Put Request
// -----------------------------------------------------------------------------
export const apiPut = ({url, o_params={}, f_success=_DF_F_SUC ,f_error, f_logout= () => {}}) => {
  const api_url  = `${_API_HOST}/${url}`;

  if(! f_error) f_error = (res) => _DF_F_ERR(res, f_logout);

  // CSRF対策
  const csrf_access_token = getCookie(_CSRF_TOKEN_NAME);

  const axiosPut = axios.create({ withCredentials: true, headers: { "X-CSRF-TOKEN": csrf_access_token } });

  axiosPut.put(api_url, o_params)
   .then ( response => f_success(response) )
   .catch( response => f_error  (response) )

}

// -----------------------------------------------------------------------------
// API: Post Request
// -----------------------------------------------------------------------------
export const apiPost = ({url, o_params={}, f_success=_DF_F_SUC ,f_error, f_logout= () => {}}) => {
  const api_url  = `${_API_HOST}/${url}`;

  if(! f_error) f_error = (res) => _DF_F_ERR(res, f_logout);

  // CSRF対策
  const csrf_access_token = getCookie(_CSRF_TOKEN_NAME);

  axios.post(api_url, o_params, {withCredentials: true, headers: { "X-CSRF-TOKEN": csrf_access_token } })
   .then ( response => f_success(response) )
   .catch( response => f_error  (response) )

}
