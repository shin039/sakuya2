# ------------------------------------------------------------------------------
# Route File: textile
# ------------------------------------------------------------------------------
from flask              import Blueprint
from flask              import request, make_response, jsonify
from flask_jwt_extended import jwt_required

bp = Blueprint('textile', __name__, url_prefix='/textile')

@bp.route("/", methods=['GET', 'POST', 'PUT', 'DELETE']) # PUT => IDを伴うINSERT, POST => IDを伴わないINSERT
@jwt_required()
def textile():
  # NOTE: request オブジェクトの仕様確認
  print(f'METHOD => {request.method}')
  print(f'DATA   => {request.get_data()}')
  # print(request.get_json())

  #data = request.get_json()
  #text = data['post_text']

  response = {'result': 'textile main.'}
  #print(response)
  return make_response(jsonify(response))

@bp.route("/<textile_id>", methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def textile_detail(textile_id):
  # NOTE: flaskの仕様確認
  response = {'result': f'textile response. {textile_id}'}
  return make_response(jsonify(response))

