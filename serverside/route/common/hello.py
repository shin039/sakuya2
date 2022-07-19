# ------------------------------------------------------------------------------
# Route File: Hello
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response
from flask_jwt_extended import create_access_token, set_access_cookies

# Proprietary Module
from db.database        import DBManager

# ------------------------------------------------------------------------------
# 共通設定
# ------------------------------------------------------------------------------
bp = Blueprint('hello', __name__, url_prefix='/hello')

# ------------------------------------------------------------------------------
# Hello Check
# ------------------------------------------------------------------------------
@bp.route('/', methods=['GET','POST'])
def login():
  print('HELLO OK')
  response = make_response({'result': 'HELLO OK!'})
  return response, 200
