# ------------------------------------------------------------------------------
# Route File: login
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response
from flask_jwt_extended import create_access_token, set_access_cookies

# Proprietary Module
from db.database        import DBManager

# ------------------------------------------------------------------------------
# 共通設定
# ------------------------------------------------------------------------------
bp = Blueprint('login', __name__, url_prefix='/login')

# ------------------------------------------------------------------------------
# Login Check
# ------------------------------------------------------------------------------
@bp.route('/', methods=['POST'])
def login():

  # Validate User
  post_data = request.get_json()
  userid    = post_data['userid']
  passwd    = post_data['password']

  # Execute Query
  result = DBManager.select('''
    SELECT
      * 
    FROM m_staff
    WHERE TRUE
      AND userid = %s
      AND passwd = crypt(%s, passwd)
    limit 1;
  ''', (str(userid), str(passwd)) )

  if len(result) > 0:
    print(f' Log In {userid}')

    # JWT アクセストークンを作成する。
    access_token = create_access_token(identity='test_user')

    # Response
    record   = result[0]
    staff_id = record["staff_id"]
    name     = record["name"]
    return_val   = {
      "userid"   :userid,
      "staff_id" :staff_id,
      "name"     : name
    }

    response = make_response(return_val)

    # アクセストークンをCookieに設定する。
    set_access_cookies(response, access_token)

    return response, 200

  else:
    print(f'Login Fail {userid}')
    response = make_response({'result': 'Login_NG', 'message': f'Login NG (user => {userid})'})
    return response, 401
