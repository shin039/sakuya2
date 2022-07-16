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
def goods():
  # Analyze URL Parameter
  dict_queryStr = request.args;
  l_params      = [];

  # - - - - - - - - - - 
  # Left Join
  # - - - - - - - - - - 
  # Discount
  str_discount     = str(dict_queryStr.get("discount"));
  is_discount      = str_discount not in ['None', '', '0']; # 0 は、全てのカテゴリの条件指定の時
  join_discount    = f"LEFT JOIN m_discount disc ON mg.goods_id = disc.goods_id and disc.company_id = {str_discount}" if(is_discount) else '';
  sel_discount_jan = "COALESCE(disc.jan     , mg.jan)"
  sel_discount_ws  = "COALESCE(disc.ws_price, mg.ws_price)"
  sel_discount_rt  = "COALESCE(disc.rt_price, mg.rt_price)"

  # - - - - - - - - - - 
  # Where
  # - - - - - - - - - - 
  # 商品名
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

  # - - - - - - - - - - 
  # Limit
  # - - - - - - - - - - 
  is_limit = dict_queryStr.get('limit') not in [None, ''];
  limit    = f'limit %s' if(is_limit) else '';
  if is_limit: l_params.append(str(dict_queryStr["limit"]));

  # - - - - - - - - - - 
  # Query String
  # - - - - - - - - - - 
  str_query = f'''
  SELECT
    -- Main
     mg.goods_id     as goods_id
    ,mg.model_no     as model_no
    ,{"mg.jan"      if (not is_discount) else sel_discount_jan} as jan
    ,mg.category     as category
    ,mg.name         as name
    ,mg.maker_id     as maker_id
    ,mg.unit_cost    as unit_cost
    ,mg.tax_rate     as tax_rate
    ,{"mg.ws_price" if (not is_discount) else sel_discount_ws} as ws_price
    ,{"mg.rt_price" if (not is_discount) else sel_discount_rt} as rt_price
    ,mg.is_delete    as is_delete
    ,mg.regist_staff as regist_staff
    ,mg.regist_time  as regist_time
    ,mg.update_staff as update_staff
    ,mg.update_time  as update_time

    -- Outer Join
    ,cat.name   as category_name
    ,maker.name as maker_name

    -- Extention
    ,mge.i01_name as i01_name ,mge.i02_name as i02_name ,mge.i03_name as i03_name ,mge.i04_name as i04_name ,mge.i05_name as i05_name
    ,mge.n01_name as n01_name ,mge.n02_name as n02_name ,mge.n03_name as n03_name ,mge.n04_name as n04_name ,mge.n05_name as n05_name
    ,mge.t01_name as t01_name ,mge.t02_name as t02_name ,mge.t03_name as t03_name ,mge.t04_name as t04_name ,mge.t05_name as t05_name

  FROM m_goods mg
    LEFT JOIN m_goods_extra   mge ON mg.goods_id = mge.goods_id
    LEFT JOIN m_category      cat ON mg.category = cat.category
    LEFT JOIN m_company     maker ON mg.maker_id = maker.company_id and maker.is_supplier
    {join_discount}
  WHERE TRUE
    {where_gname}
    {where_category}
    {where_maker}
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
@bp.route("/<goods_id>", methods=['GET', 'POST', 'PUT', 'DELETE']) # PUT => IDを伴うINSERT, POST => IDを伴わないINSERT
@jwt_required()
def goods_detail(goods_id):
  # NOTE: request オブジェクトの仕様確認
  print(f'METHOD => {request.method}')
  print(f'DATA   => {request.get_data()}')
  
  # NOTE: application/jsonでjsonデータ等をもらう時。
  #data = request.get_json()
  #text = data['post_text']

  result   = DBManager.select('SELECT * FROM m_goods WHERE goods_id = %s;', (str(goods_id),) ) # , はtupleとして認識させるため
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# TODO Detail Data: Update
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# TODO Detail Data: Delete
# ------------------------------------------------------------------------------
