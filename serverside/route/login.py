from flask import Blueprint
from flask import request, make_response

bp = Blueprint('login', __name__, url_prefix='/login')

# TODO:
#       ログイン情報が正しければ、アクセストークンを発行して、処理を許可する。
#        -> てことは、ログイン情報の保持が必要。履歴もあった方が良いし、テーブル作成するか。
@bp.route('/', methods=['GET'])
def login():
  return make_response(f'login parser:)  [METHOD => {request.method}]');
