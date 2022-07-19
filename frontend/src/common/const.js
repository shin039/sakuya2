// -----------------------------------------------------------------------------
//  Constant Definition
// -----------------------------------------------------------------------------
// Material-ui Iconは、from で個別で読み取らないとコンパイルがすごく重くなる。
import DashboardIcon    from '@mui/icons-material/Dashboard';
import PrintIcon        from '@mui/icons-material/Print';
import GoodsIcon        from '@mui/icons-material/BusinessCenter';
/*
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon       from '@mui/icons-material/People';
import BarChartIcon     from '@mui/icons-material/BarChart';
import LayersIcon       from '@mui/icons-material/Layers';
import AssignmentIcon   from '@mui/icons-material/Assignment';
*/

// Menu & Route Setting
export const MENU_LIST = [
  {icon: DashboardIcon   , title: 'Dashboard'    , path: 'main'    },
  {icon: PrintIcon       , title: 'Barcode Print', path: 'barcode' },

  /*
  {icon: ShoppingCartIcon, title: 'Orders'       , path: 'main'    },
  {icon: PeopleIcon      , title: 'Customers'    , path: 'main'    },
  {icon: BarChartIcon    , title: 'Reports'      , path: 'main'    },
  {icon: LayersIcon      , title: 'Integrations' , path: 'main'    },
  */
]

// SubMenu & Route Setting
export const MENU_SECONDARY_LIST = [
  {icon: GoodsIcon, title: 'Goods', path: 'goods'},
]
