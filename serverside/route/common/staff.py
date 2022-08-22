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
# PUT: Update
# - - - - - - - - - - - - - - - - - - 
def __staff_detail_put(request, userid):

  # PUTデータ
  json = request.get_json()

  # 更新対象のキー
  l_keys       = ['passwd', 'name', 'birthday', 'tel', 'mail']
  l_parmitNull = ['birthday', 'tel', 'mail']

  # それ以外のキー
  opeStaffId = json.get('opeStaffId', None)

  # 更新値の取得
  s_update = ''
  l_params = []

  for key in l_keys:
    value = json.get(key, None) 

    if(value != None):
      if value == '' and key in l_parmitNull:
        s_update += f',{key}=null';

      else:
        s_update += f',{key}=%s';
        l_params.append(value);

  # その他情報を追加
  l_params.append(opeStaffId) # Set update_staff
  l_params.append(userid)     # Where userid

  # 最初の,は削除する。
  s_update = s_update.replace(',', ' ', 1)

  # 更新SQLの生成
  sql = f'''
  UPDATE m_staff
  SET
    {s_update}
   ,update_staff = %s
   ,update_time  = now()
  WHERE TRUE
    AND userid = %s;
  ''';

  result   = DBManager.update(sql, tuple(l_params), opeStaffId) # , はtupleとして認識させるため
  response = {'result': result}
  return make_response(jsonify(response))

# - - - - - - - - - - - - - - - - - - 
# GET: Select
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
# TODO Detail Data: Delete
# ------------------------------------------------------------------------------
