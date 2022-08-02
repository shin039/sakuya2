# ------------------------------------------------------------------------------
# Route File: material
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response, jsonify
from flask_jwt_extended import jwt_required

# Proprietary Module
from db.database        import DBManager

# ------------------------------------------------------------------------------
# 共通設定
# ------------------------------------------------------------------------------
bp = Blueprint('material', __name__, url_prefix='/material')

# ------------------------------------------------------------------------------
# List Data: Select
# ------------------------------------------------------------------------------
@bp.route("/goods/<goods_id>", methods=['GET'])
@jwt_required()
def material(goods_id):
  # Analyze URL Parameter
  dict_queryStr = request.args;
  l_params      = [];

  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  # Where
  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  # material Id (詳細検索の時)
  is_goodsId  = goods_id not in [None, ''];
  where_goodsId = f" AND g.goods_id = %s" if(is_goodsId) else '';
  if is_goodsId:
    str_goodsId = str(goods_id);
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
    g.goods_id             AS goods_id
   ,mk.name                AS material_kind_name
   ,mt.name                AS material_type_name
   ,c.name                 AS maker_name
   ,m.name                 AS material_name
   ,gm.uses                AS uses
   ,gm.discription         AS discription
   ,m.unit_price           AS unit_price
   ,m.unit                 AS unit
   ,m.tax                  AS tax
   ,COALESCE(gs.sku_id, 0) AS sku_id
   
   ,gs.i01_name as i01_name ,gs.i02_name as i02_name ,gs.i03_name as i03_name ,gs.i04_name as i04_name ,gs.i05_name as i05_name
   ,gs.n01_name as n01_name ,gs.n02_name as n02_name ,gs.n03_name as n03_name ,gs.n04_name as n04_name ,gs.n05_name as n05_name
   ,gs.t01_name as t01_name ,gs.t02_name as t02_name ,gs.t03_name as t03_name ,gs.t04_name as t04_name ,gs.t05_name as t05_name
   
   ,gst.i01_name as t_i01_name ,gst.i02_name as t_i02_name ,gst.i03_name as t_i03_name ,gst.i04_name as t_i04_name ,gst.i05_name as t_i05_name
   ,gst.n01_name as t_n01_name ,gst.n02_name as t_n02_name ,gst.n03_name as t_n03_name ,gst.n04_name as t_n04_name ,gst.n05_name as t_n05_name
   ,gst.t01_name as t_t01_name ,gst.t02_name as t_t02_name ,gst.t03_name as t_t03_name ,gst.t04_name as t_t04_name ,gst.t05_name as t_t05_name
  
  -- ---------------------------------------------------------------
  FROM m_goods g
    LEFT JOIN m_goods_material  gm ON g.goods_id        = gm.goods_id
    LEFT JOIN m_material         m ON gm.material_id    = m.material_id
    LEFT JOIN m_material_type   mt ON m.material_type   = mt.material_type
    LEFT JOIN m_material_kind   mk ON mt.material_kind  = mk.material_kind
    LEFT JOIN m_company          c ON m.maker_id        = c.company_id
    LEFT JOIN m_goods_sku       gs ON gm.sku_id         = gs.sku_id
    LEFT JOIN m_goods_sku_type gst ON gs.goods_sku_type = gst.goods_sku_type
  
  -- ---------------------------------------------------------------
  WHERE TRUE
    AND NOT COALESCE( g.is_delete, false)
    AND NOT COALESCE(gs.is_delete, false)
    AND NOT COALESCE( m.is_delete, false)
    AND m.material_id IS NOT NULL
    {where_goodsId}
  
  ORDER BY sku_id, mt.material_type, gm.goods_material_id
  {limit};
  '''

  # Execute Query
  result   = DBManager.select(str_query, tuple(l_params))
  response = {'result': result}

  return make_response(jsonify(response))

