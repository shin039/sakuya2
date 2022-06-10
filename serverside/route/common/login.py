from flask              import Blueprint
from flask              import request, make_response
from flask_jwt_extended import create_access_token, set_access_cookies

bp = Blueprint('login', __name__, url_prefix='/login')

# TODO:
#       ログイン情報が正しければ、アクセストークンを発行して、処理を許可する。
#        -> てことは、ログイン情報の保持が必要。履歴もあった方が良いし、テーブル作成するか。
@bp.route('/', methods=['GET'])
def login():
  # TODO POSTに分ける
  # JWT アクセストークンを作成する。
  access_token = create_access_token(identity='test_user')

  response = make_response(f'login parser:)  [METHOD => {request.method}], Token => {access_token}')

  # アクセストークンをCookieに設定する。
  set_access_cookies(response, access_token)

  return response, 200
