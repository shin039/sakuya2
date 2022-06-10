from flask import Blueprint, redirect

bp = Blueprint('main', __name__, url_prefix='/')

@bp.route('/', methods=['GET'])
def main():
  # ログイン画面にリダイレクトする。
  return redirect('/login')
