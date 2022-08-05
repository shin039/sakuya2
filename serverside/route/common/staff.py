# ------------------------------------------------------------------------------
# Route File: staff
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response, jsonify
from flask_jwt_extended import jwt_required

# Proprietary Module
from db.database        import DBManager

# ------------------------------------------------------------------------------
# 共通設定
# ------------------------------------------------------------------------------
bp = Blueprint('staff', __name__, url_prefix='/staff')

# ------------------------------------------------------------------------------
# List Data: Select
# ------------------------------------------------------------------------------
@bp.route("/", methods=['GET'])
@jwt_required()
def staff():
  # Analyze URL Parameter
  dict_queryStr = request.args;
  l_params      = [];

  # Limit
  is_limit = dict_queryStr.get('limit') not in [None, ''];
  limit    = f'limit %s' if(is_limit) else '';
  if is_limit: l_params.append(str(dict_queryStr["limit"]));

  # Query String
  str_query = f' SELECT * FROM m_staff WHERE TRUE ORDER BY staff_id {limit};'

  # Execute Query
  result   = DBManager.select(str_query, tuple(l_params))
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# Detail Data: Select
# ------------------------------------------------------------------------------
@bp.route("/<userid>", methods=['GET', 'POST', 'PUT', 'DELETE']) # PUT => IDを伴うINSERT, POST => IDを伴わないINSERT
@jwt_required()
def staff_detail(userid):
  req_method = request.method
  
  if req_method == 'GET':
    sql = '''
    SELECT
      staff_id    
     ,userid      
     ,passwd      
     ,name        
     ,to_char(birthday, 'YYYY/MM/DD') as birthday
     ,tel         
     ,mail        
     ,authority
     ,is_delete   
     ,regist_staff
     ,to_char(regist_time, 'YYYY/MM/DD HH24:MI:SS') as regist_time
     ,update_staff
     ,to_char(update_time, 'YYYY/MM/DD HH24:MI:SS') as update_time
    FROM m_staff
    WHERE TRUE
      AND userid = %s;
    ''';
    result   = DBManager.select(sql, (str(userid),) ) # , はtupleとして認識させるため
    response = {'result': result}

    return make_response(jsonify(response))

  # DEBUG それ以外の時
  print('# Not GET Goods Detail.')
  result   = DBManager.select('SELECT * FROM m_staff WHERE userid = %s;', (str(userid),) ) # , はtupleとして認識させるため
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# TODO Detail Data: Update
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# TODO Detail Data: Delete
# ------------------------------------------------------------------------------
