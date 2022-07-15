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
bp = Blueprint('company', __name__, url_prefix='/company')

# ------------------------------------------------------------------------------
# List Data: Select
# ------------------------------------------------------------------------------
@bp.route("/", methods=['GET'])
@jwt_required()
def company():
  # Analyze URL Parameter
  dict_queryStr = request.args;
  l_params      = [];

  # is supplier
  is_isSupplier = dict_queryStr.get("is_supplier") in ['true'];
  isSupplier    = f" AND is_supplier " if(is_isSupplier) else '';
  
  # Limit
  is_limit = dict_queryStr.get('limit') not in [None, ''];
  limit    = f'limit %s' if(is_limit) else '';
  if is_limit: l_params.append(str(dict_queryStr["limit"]));

  # Query String
  str_query = f' SELECT * FROM m_company WHERE TRUE {isSupplier} ORDER BY company_id {limit};'

  # Execute Query
  result   = DBManager.select(str_query, tuple(l_params))
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# Detail Data: Select
# ------------------------------------------------------------------------------
@bp.route("/<company_id>", methods=['GET', 'POST', 'PUT', 'DELETE']) # PUT => IDを伴うINSERT, POST => IDを伴わないINSERT
@jwt_required()
def company_detail(company_id):
  # NOTE: request オブジェクトの仕様確認
  print(f'METHOD => {request.method}')
  print(f'DATA   => {request.get_data()}')
  
  # NOTE: application/jsonでjsonデータ等をもらう時。
  #data = request.get_json()
  #text = data['post_text']

  result   = DBManager.select('SELECT * FROM m_company WHERE company_id = %s;', (str(company_id),) ) # , はtupleとして認識させるため
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# TODO Detail Data: Update
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# TODO Detail Data: Delete
# ------------------------------------------------------------------------------
