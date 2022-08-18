# ------------------------------------------------------------------------------
# Route File: goods
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response, jsonify
from flask_jwt_extended import jwt_required

# Proprietary Module
from db.database        import DBManager

# ------------------------------------------------------------------------------
# 共通設定
# ------------------------------------------------------------------------------
bp = Blueprint('goods', __name__, url_prefix='/goods')

# ------------------------------------------------------------------------------
# List Data: Select
# ------------------------------------------------------------------------------
@bp.route("/", methods=['GET'])
@jwt_required()
def goods(a_goodsId=None):

  # Analyze URL Parameter
  dict_queryStr = request.args;
  l_params      = [];

  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  # Left Join
  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  # Discount
  str_discount       = str(dict_queryStr.get("discount"));
  is_discount        = str_discount not in ['None', '', '0']; # 0 は、全てのカテゴリの条件指定の時
  join_discount      = f"LEFT JOIN m_discount disc ON mgs.sku_id = disc.sku_id and disc.company_id = {str_discount}" if(is_discount) else '';
  sel_discount_jan   = "COALESCE(disc.jan     , mgs.jan)"
  sel_discount_ws    = "COALESCE(disc.ws_price, mgs.ws_price)"
  sel_discount_rt    = "COALESCE(disc.rt_price, mgs.rt_price)"
  sel_discount_extra = '''
    ,COALESCE(disc.i01_name, mgs.i01_name) as i01_name, COALESCE(disc.i02_name, mgs.i02_name) as i02_name, COALESCE(disc.i03_name, mgs.i03_name) as i03_name, COALESCE(disc.i04_name, mgs.i04_name) as i04_name, COALESCE(disc.i05_name, mgs.i05_name) as i05_name
    ,COALESCE(disc.n01_name, mgs.n01_name) as n01_name, COALESCE(disc.n02_name, mgs.n02_name) as n02_name, COALESCE(disc.n03_name, mgs.n03_name) as n03_name, COALESCE(disc.n04_name, mgs.n04_name) as n04_name, COALESCE(disc.n05_name, mgs.n05_name) as n05_name
    ,COALESCE(disc.t01_name, mgs.t01_name) as t01_name, COALESCE(disc.t02_name, mgs.t02_name) as t02_name, COALESCE(disc.t03_name, mgs.t03_name) as t03_name, COALESCE(disc.t04_name, mgs.t04_name) as t04_name, COALESCE(disc.t05_name, mgs.t05_name) as t05_name
  ''';

  where_discount_isdelete = "  AND NOT COALESCE(disc.is_delete, false) " if(is_discount) else "";

  # SKU (DISCOUNTより後に設定すること)
  str_notSku = str(dict_queryStr.get("not_sku"));
  is_sku     = str_notSku in ['None', ''];

  join_sku   = f'''
  LEFT JOIN m_goods_sku       mgs ON mg.goods_id        = mgs.goods_id
  LEFT JOIN m_goods_sku_type mgst ON mgs.goods_sku_type = mgst.goods_sku_type
  ''' if(is_sku) else '';

  sel_normal_extra   = '''
    ,mgs.i01_name as i01_name ,mgs.i02_name as i02_name ,mgs.i03_name as i03_name ,mgs.i04_name as i04_name ,mgs.i05_name as i05_name
    ,mgs.n01_name as n01_name ,mgs.n02_name as n02_name ,mgs.n03_name as n03_name ,mgs.n04_name as n04_name ,mgs.n05_name as n05_name
    ,mgs.t01_name as t01_name ,mgs.t02_name as t02_name ,mgs.t03_name as t03_name ,mgs.t04_name as t04_name ,mgs.t05_name as t05_name
  ''';

  sel_sku    = f'''
    ,mgs.sku_id      as sku_id
    ,mgs.model_no    as model_no
    ,{"mgs.jan"      if (not is_discount) else sel_discount_jan} as jan
    ,mgs.unit_cost   as unit_cost
    ,mgs.tax_rate    as tax_rate
    ,{"mgs.ws_price" if (not is_discount) else sel_discount_ws} as ws_price
    ,{"mgs.rt_price" if (not is_discount) else sel_discount_rt} as rt_price

    -- Extra
    {sel_normal_extra if (not is_discount) else sel_discount_extra}

    -- Extra Type
    ,mgst.i01_name as t_i01_name ,mgst.i02_name as t_i02_name ,mgst.i03_name as t_i03_name ,mgst.i04_name as t_i04_name ,mgst.i05_name as t_i05_name
    ,mgst.n01_name as t_n01_name ,mgst.n02_name as t_n02_name ,mgst.n03_name as t_n03_name ,mgst.n04_name as t_n04_name ,mgst.n05_name as t_n05_name
    ,mgst.t01_name as t_t01_name ,mgst.t02_name as t_t02_name ,mgst.t03_name as t_t03_name ,mgst.t04_name as t_t04_name ,mgst.t05_name as t_t05_name
  ''' if(is_sku) else '';

  where_sku_isdelete = "   AND NOT mgs.is_delete " if(is_sku) else ''

  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  # Where
  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  # - - - - - - - - - - - - - - - - - - 
  # Main
  # - - - - - - - - - - - - - - - - - - 
  # Goods Name
  is_gname    = dict_queryStr.get('goods_name') not in [None, ''];
  where_gname = f" AND mg.name like %s" if(is_gname) else '';
  if is_gname:
    str_gname = str(dict_queryStr["goods_name"]);
    l_params.append(f"%{str_gname}%");

  # Category
  str_category   = str(dict_queryStr.get("category"));
  is_category    = str_category not in ['None', '', '0']; # 0 は、全てのカテゴリの条件指定の時
  where_category = f" AND mg.category = %s" if(is_category) else '';
  if is_category:
    l_params.append(f"{str_category}");

  # Maker
  str_maker   = str(dict_queryStr.get("maker"));
  is_maker    = str_maker not in ['None', '', '0']; # 0 は、全てのカテゴリの条件指定の時
  where_maker = f" AND mg.maker_id = %s" if(is_maker) else '';
  if is_maker:
    l_params.append(f"{str_maker}");

  # Goods Id (詳細検索の時)
  is_goodsId    = a_goodsId not in [None, ''];
  where_goodsId = f" AND mg.goods_id = %s" if(is_goodsId) else '';
  if is_goodsId:
    str_goodsId = str(a_goodsId);
    l_params.append(f"{str_goodsId}");

  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  # Limit
  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  is_limit = dict_queryStr.get('limit') not in [None, ''];
  limit    = f'limit %s' if(is_limit) else '';
  if is_limit: l_params.append(str(dict_queryStr["limit"]));

  # - - - - - - - - - - 
  # Query String
  # - - - - - - - - - - 
  str_query = f'''
  -- ---------------------------------------------------------------
  SELECT
    -- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    -- Main
    -- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
     mg.goods_id     as goods_id
    ,mg.category     as category
    ,mg.name         as name
    ,mg.maker_id     as maker_id
    ,mg.is_delete    as is_delete
    ,mg.regist_staff as regist_staff
    ,mg.regist_time  as regist_time
    ,mg.update_staff as update_staff
    ,mg.update_time  as update_time

    -- Outer Table
    ,cat.name   as category_name
    ,maker.name as maker_name

    -- SKU
    {sel_sku}

  -- ---------------------------------------------------------------
  FROM m_goods mg
    -- Main
    LEFT JOIN m_category   cat ON mg.category = cat.category
    LEFT JOIN m_company  maker ON mg.maker_id = maker.company_id and maker.is_supplier
    -- SKU
    {join_sku}
    -- DISCOUNT
    {join_discount}

  -- ---------------------------------------------------------------
  WHERE TRUE
    -- Main
    AND NOT mg.is_delete
    {where_gname}
    {where_category}
    {where_maker}
    {where_goodsId}

    -- SKU
    {where_sku_isdelete}
    {where_discount_isdelete}

  -- ---------------------------------------------------------------
  ORDER BY goods_id
  {limit};
  '''

  # Execute Query
  result   = DBManager.select(str_query, tuple(l_params))
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# Detail Data: Select
# ------------------------------------------------------------------------------
@bp.route("/<goods_id>", methods=['GET', 'POST', 'DELETE']) # PUT => IDを伴うINSERT, POST => IDを伴わないINSERT
@jwt_required()
def goods_detail(goods_id):
  req_method = request.method

  # NOTE: request オブジェクトの仕様確認
  #print(f'DATA   => {request.get_data()}')
  
  # NOTE: application/jsonでjsonデータ等をもらう時。
  #data = request.get_json()
  #text = data['post_text']

  if req_method == 'GET':
    # TODO discount情報
    return goods(goods_id)


  # DEBUG それ以外の時
  print('# Not GET Goods Detail.')
  result   = DBManager.select('SELECT * FROM m_goods WHERE goods_id = %s;', (str(goods_id),) ) # , はtupleとして認識させるため
  response = {'result': result}

  return make_response(jsonify(response))

