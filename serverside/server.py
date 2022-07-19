# ------------------------------------------------------------------------------
# Import
# ------------------------------------------------------------------------------
# Standard Module
from datetime  import datetime, timedelta, timezone
from os        import getenv, sep
from sys       import stderr
from glob      import glob
from importlib import import_module
from csv       import reader

# flask
from flask              import Flask
from flask              import make_response, jsonify
from flask_cors         import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import set_access_cookies

# dotenv
from dotenv import load_dotenv
load_dotenv()

# ------------------------------------------------------------------------------
# Environment
# ------------------------------------------------------------------------------
PRODUCTION = 'PRODUCTION'
ENV        = getenv('APP_ENV')
IS_DEV     = (ENV != PRODUCTION)

# NOTE: 環境変数一覧
#for key, val in environ.items():
#    print('{key}: {val}')
print(f'# This Server Starting {ENV} Mode')

# ------------------------------------------------------------------------------
# Server
# ------------------------------------------------------------------------------
app = Flask(__name__, static_folder="./build/static", template_folder="./build")

# Strict Slashes to Flase
#  -> For CORS, when OPTION reauest redirect 308
app.url_map.strict_slashes = False

# Cross Origin Resource Sharing
ORIGINS = getenv('APP_FRONT_URL').split(',')
print(f'# CORS Allow URL is {ORIGINS}')
CORS(app, supports_credentials=True, origins=ORIGINS) 

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# JWT Settings
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
JWT_SECRET_KEY    = getenv('APP_JWT_SECRET_KEY')
JWT_COOKIE_DOMAIN = getenv('APP_JWT_COOKIE_DOMAIN')

app.config["JWT_SECRET_KEY"]           = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=10)
app.config["JWT_TOKEN_LOCATION"]       = ['cookies']
app.config["JWT_COOKIE_SAMESITE"]      = "Strict";
app.config["JWT_COOKIE_SECURE"]        = False; # or False. 要検討。HTTPSの時のみCookie送信。
#app.config["JWT_COOKIE_DOMAIN"]        = JWT_COOKIE_DOMAIN

jwt = JWTManager(app);

# - - - - - - - - - - - - - - 
# JWT Refresh TOKEN
# - - - - - - - - - - - - - - 
@app.after_request
def refresh_expiring_jwts(response):

  try:
    exp_timestamp = get_jwt()["exp"]
    now = datetime.now(timezone.utc)
    target_timestamp = datetime.timestamp(now + timedelta(minutes=10)) # TODO ひとまず更新時間を10分にしている。

    if target_timestamp > exp_timestamp:
      access_token = create_access_token(identity=get_jwt_identity())
      set_access_cookies(response, access_token)
      return response

  except (RuntimeError, KeyError):
    # Case where there is not a valid JWT. Just return the original response
    return response

# - - - - - - - - - - - - - - 
# JWT TOKEN ERR
# - - - - - - - - - - - - - - 
# 期限切れ
@jwt.expired_token_loader
def jwt_expired_token_callback(e, unknown):
  return jsonify({
      'status'   : 401,
      'sub_staus': 1,
      'msg': 'The token has expired',
  }), 401

# 未認証
@jwt.unauthorized_loader
def jwt_unauthorized_token_callback(e):
  return jsonify({
      'status': 401,
      'sub_status': 2,
      'msg': 'The token has unauthorized',
  }), 401

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Error Handler Settings
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# TODO エラーハンドリングとログ出力
@app.errorhandler(Exception)
def exception_handler(e):
  print(f"ERROR: {e}", file=stderr)
  response = {'error': str(e)}
  return make_response(jsonify(response))

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Route Settings (Module Import)
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

# route common
for val in glob('./route/common/*.py'):
  module_name = val[val.rfind(sep) + 1:-3]
  module      = import_module(f'route.common.{module_name}')
  app.register_blueprint(module.bp)

# route foreach
for val in glob('./route/foreach/*.py'):
  module_name = val[val.rfind(sep) + 1:-3]
  module      = import_module(f'route.foreach.{module_name}')
  app.register_blueprint(module.bp)

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------
if __name__ == "__main__":
  if IS_DEV:
    app.debug = True
    app.Test  = True
    app.env   = ENV

  # To Set .env, host and port
  HOST = getenv('APP_SV_HOST')
  PORT = getenv('APP_SV_PORT')
  app.run(host=HOST, port=PORT)
