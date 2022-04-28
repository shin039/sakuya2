# ------------------------------------------------------------------------------
# Import
# ------------------------------------------------------------------------------
from flask      import Flask
from flask_cors import CORS
from route      import main, login, textile

import os
from dotenv import load_dotenv
load_dotenv()

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

  app.run(host='127.0.0.1', port=5000)
