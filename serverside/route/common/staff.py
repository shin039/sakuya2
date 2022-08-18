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
@bp.route("/", methods=['GET', 'PUT'])
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

  # GET
  if req_method == 'GET': return __staff_detail_get(userid)
  # PUT
  if req_method == 'PUT': return __staff_detail_put(request, userid)

  # それ以外の時
  response = {'result': 'no_service', 'message': 'サービスがありません。'}
  return make_response(jsonify(response)), 500

# - - - - - - - - - - - - - - - - - - 
# PUT
# - - - - - - - - - - - - - - - - - - 
def __staff_detail_put(request, userid):
  try:
    # 更新値の取得
    json = request.get_json()
    passwd   = json.get('passwd'  , None);
    name     = json.get('name'    , None);
    birthday = json.get('birthday', None);
    tel      = json.get('tel'     , None);
    mail     = json.get('mail'    , None);

    # 更新SQLの生成
    sql = f'''
    UPDATE staff
    SET
      passwd       = %s
     ,name         = %s
     ,birthday     = %s
     ,tel          = %s
     ,mail         = %s
     ,update_staff = %s
     ,update_time  = %s
    WHERE TRUE
      AND userid = %s;
    ''';

    # TODO UPDATE の仕組みを作る。
    result   = DBManager.select('SELECT * FROM m_staff WHERE userid = %s;', (str(userid),) ) # , はtupleとして認識させるため
    response = {'result': result}
    return make_response(jsonify(response))

  except Exception as e:
    print(e)

# - - - - - - - - - - - - - - - - - - 
# GET
# - - - - - - - - - - - - - - - - - - 
def __staff_detail_get(userid):
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


# ------------------------------------------------------------------------------
# TODO Detail Data: Update
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# TODO Detail Data: Delete
# ------------------------------------------------------------------------------
