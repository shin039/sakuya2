# ------------------------------------------------------------------------------
# Import
# ------------------------------------------------------------------------------
# Standard Module
import os, datetime

# flask
from flask              import Flask
from flask_cors         import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required

# dotenv
from dotenv import load_dotenv
load_dotenv()

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Proprietary Module
from route      import main, login, textile

# ------------------------------------------------------------------------------
# Environment
# ------------------------------------------------------------------------------
PRODUCTION = 'PRODUCTION'
ENV        = os.getenv('ENV')
IS_DEV     = (ENV != PRODUCTION)

# NOTE: 環境変数一覧
#for key, val in os.environ.items():
#    print('{key}: {val}')

print(f'# This Server Starting {ENV} Mode')

# ------------------------------------------------------------------------------
# Server
# ------------------------------------------------------------------------------
app = Flask(__name__, static_folder="./build/static", template_folder="./build")

# Cross Origin Resource Sharing
CORS(app) 

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# JWT Setting
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# TODO
# app.config.from_object('config') => config.pyなどに設定を入れておいて読み込む?
app.config["JWT_SECRET_KEY"]           = "TODO It's Secret Key. Set to ENV."
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=10)
app.config["JWT_TOKEN_LOCATION"]       = ['cookies']
app.config["JWT_COOKIE_SAMESITE"]      = "Strict";
#app.config["JWT_COOKIE_SECURE"]        = True; # or False. 要検討。

jwt = JWTManager(app);

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Route Setting
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
app.register_blueprint(main.bp)
app.register_blueprint(login.bp)
app.register_blueprint(textile.bp)

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------
if __name__ == "__main__":
  if IS_DEV:
    app.debug = True
    app.Test  = True
    app.env   = ENV

  # To Set .env, host and port
  app.run(host='127.0.0.1', port=5000)
