// -----------------------------------------------------------------------------
//  Constant Definition
// -----------------------------------------------------------------------------
// Material-ui Iconは、from で個別で読み取らないとコンパイルがすごく重くなる。
import DashboardIcon from '@mui/icons-material/Dashboard';
import PrintIcon     from '@mui/icons-material/Print';
import GoodsIcon     from '@mui/icons-material/BusinessCenter';
import CalculateIcon from '@mui/icons-material/Calculate';

// Menu & Route Setting
export const MENU_LIST = [
  {icon: DashboardIcon, title: 'ダッシュボード', path: 'main'        },
  {icon: PrintIcon    , title: 'バーコード印刷', path: 'barcode'     },
  {icon: CalculateIcon, title: '請求書印刷'    , path: 'invoice'     },
  {icon: CalculateIcon, title: '糸量計算'      , path: 'yarn_ammount'},
]

// SubMenu & Route Setting
export const MENU_SECONDARY_LIST = [
  {icon: GoodsIcon, title: '商品マスタ', path: 'goods'},
]

// No Menu
export const MENU_NOMENU_LIST = [
  {icon: null, title: 'アカウント設定', path: 'account'},
]

// Validation Regex
export const REGEX_VALIDATION = {
  // X文字以上
  min     : min => new RegExp(`^.{${min},}$`),
  // X文字以内
  max     : max => new RegExp(`^.{0,${max}}$`), // X文字以内
  // 英数半角記号で X文字以上
  passwd  : min => new RegExp(`^[\x01-\x7E]{${min},}$`),
  // YYYY/MM/DD
  yyyymmdd: () => /^[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/g,
  // 市外局番ありと携帯の電話番号
  tel     : () => /^(0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1})[-)]?\d{4})|(0[5789]0[-(]?\d{4}[-)]?\d{4})$/,
  // E-MAIL
  email   : () => /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
}
