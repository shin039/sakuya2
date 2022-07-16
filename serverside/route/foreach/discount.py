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

