# ------------------------------------------------------------------------------
# Route File: goods
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response, jsonify
from flask_jwt_extended import jwt_required

# Proprietary Module
from db.database        import DBManager

# ------------------------------------------------------------------------------
# 共通設定
# ------------------------------------------------------------------------------
bp = Blueprint('goods', __name__, url_prefix='/goods')

# ------------------------------------------------------------------------------
# List Data: Select
# ------------------------------------------------------------------------------
@bp.route("/", methods=['GET'])
@jwt_required()
def goods():
  result   = DBManager.select('SELECT * FROM m_goods ORDER BY goods_id;', ())
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# Detail Data: Select
# ------------------------------------------------------------------------------
@bp.route("/<goods_id>", methods=['GET', 'POST', 'PUT', 'DELETE']) # PUT => IDを伴うINSERT, POST => IDを伴わないINSERT
@jwt_required()
def goods_detail(goods_id):
  # NOTE: request オブジェクトの仕様確認
  print(f'METHOD => {request.method}')
  print(f'DATA   => {request.get_data()}')
  
  # NOTE: application/jsonでjsonデータ等をもらう時。
  #data = request.get_json()
  #text = data['post_text']

  result   = DBManager.select('SELECT * FROM m_goods WHERE goods_id = %s;', (str(goods_id),) ) # , はtupleとして認識させるため
  response = {'result': result}

  return make_response(jsonify(response))

# ------------------------------------------------------------------------------
# TODO Detail Data: Update
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# TODO Detail Data: Delete
# ------------------------------------------------------------------------------
