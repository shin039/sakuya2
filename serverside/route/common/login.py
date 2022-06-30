from flask              import Blueprint
from flask              import request, make_response
from flask_jwt_extended import create_access_token, set_access_cookies

bp = Blueprint('login', __name__, url_prefix='/login')

# TODO:
#       ログイン情報が正しければ、アクセストークンを発行して、処理を許可する。
#        -> てことは、ログイン情報の保持が必要。履歴もあった方が良いし、テーブル作成するか。
@bp.route('/', methods=['POST'])
def login():
  # JWT アクセストークンを作成する。
  access_token = create_access_token(identity='test_user')
  return_val   = {"method" :request.method, "token" :access_token}

  response = make_response(return_val)

  # アクセストークンをCookieに設定する。
  set_access_cookies(response, access_token)

  return response, 200
