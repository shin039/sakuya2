# ------------------------------------------------------------------------------
# Route File: company
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response, jsonify
from flask_jwt_extended import jwt_required

# Proprietary Module
from db.database        import DBManager

# ------------------------------------------------------------------------------
# 共通設定
# ------------------------------------------------------------------------------
bp = Blueprint('discount', __name__, url_prefix='/discount')

# ------------------------------------------------------------------------------
# List Data: Select
# ------------------------------------------------------------------------------
@bp.route("/", methods=['GET'])
@jwt_required()
def company():
  # Analyze URL Parameter
  dict_queryStr = request.args;
  l_params      = [];

  # Limit
  is_limit = dict_queryStr.get('limit') not in [None, ''];
  limit    = f'limit %s' if(is_limit) else '';
  if is_limit: l_params.append(str(dict_queryStr["limit"]));

  # Query String
  str_query = f' SELECT * FROM m_discount WHERE TRUE ORDER BY company_id {limit};'

  # Execute Query
  result   = DBManager.select(str_query, tuple(l_params))
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# List Data: Select for Company List
# ------------------------------------------------------------------------------
@bp.route("/company", methods=['GET'])
@jwt_required()
def company_list():
  # Analyze URL Parameter
  dict_queryStr = request.args
  l_params      = []

  # Limit
  is_limit = dict_queryStr.get('limit') not in [None, '']
  limit    = f'limit %s' if(is_limit) else ''
  if is_limit: l_params.append(str(dict_queryStr["limit"]))

  query = f'''
    SELECT
      distinct dc.company_id as company_id
     ,cp.name                as name
    FROM m_discount dc
      LEFT JOIN m_company cp ON dc.company_id = cp.company_id
    ORDER BY dc.company_id
    {limit}
    ;
  '''

  result   = DBManager.select(query, tuple(l_params))
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# List Data: Select for Goods List
# ------------------------------------------------------------------------------
@bp.route("/goods/<goods_id>", methods=['GET'])
@jwt_required()
def goods_list(goods_id):
  # Analyze URL Parameter
  dict_queryStr = request.args
  l_params      = []

  # Goods Id
  is_goodsId    = goods_id not in [None, ''];
  where_goodsId = f" AND g.goods_id = %s" if(is_goodsId) else '';
  if is_goodsId:
    str_goodsId = str(goods_id);
    l_params.append(f"{str_goodsId}");

  # Limit

  query = f'''
SELECT 
   d.discount_id AS discount_id
  ,c.name        AS company_name
  ,d.sku_id      AS sku_id
  ,d.ratio       AS tax_rate
  ,d.ws_price    AS ws_price
  ,d.rt_price    AS rt_price
  ,d.jan         AS jan

  -- Extra
  ,gs.i01_name as i01_name ,gs.i02_name as i02_name ,gs.i03_name as i03_name ,gs.i04_name as i04_name ,gs.i05_name as i05_name
  ,gs.n01_name as n01_name ,gs.n02_name as n02_name ,gs.n03_name as n03_name ,gs.n04_name as n04_name ,gs.n05_name as n05_name
  ,gs.t01_name as t01_name ,gs.t02_name as t02_name ,gs.t03_name as t03_name ,gs.t04_name as t04_name ,gs.t05_name as t05_name

  -- Extra Type
  ,gst.i01_name as t_i01_name ,gst.i02_name as t_i02_name ,gst.i03_name as t_i03_name ,gst.i04_name as t_i04_name ,gst.i05_name as t_i05_name
  ,gst.n01_name as t_n01_name ,gst.n02_name as t_n02_name ,gst.n03_name as t_n03_name ,gst.n04_name as t_n04_name ,gst.n05_name as t_n05_name
  ,gst.t01_name as t_t01_name ,gst.t02_name as t_t02_name ,gst.t03_name as t_t03_name ,gst.t04_name as t_t04_name ,gst.t05_name as t_t05_name

FROM m_goods g
  LEFT JOIN m_goods_sku       gs ON g.goods_id        = gs.goods_id
  LEFT JOIN m_goods_sku_type gst ON gs.goods_sku_type = gst.goods_sku_type
  LEFT JOIN m_discount         d ON gs.sku_id         = d.sku_id
  LEFT JOIN m_company          c ON d.company_id      = c.company_id

WHERE TRUE
  {where_goodsId}
ORDER BY d.discount_id
;
  '''

  result   = DBManager.select(query, tuple(l_params))
  response = {'result': result}

  return make_response(jsonify(response))

