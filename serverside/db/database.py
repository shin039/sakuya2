# ------------------------------------------------------------------------------
# DB Connect & Transaction
# ------------------------------------------------------------------------------
from os                   import getenv
from db.vendor.postgresql import PostgreSQL

# ------------------------------------------------------------------------------
# DB Management Class
# ------------------------------------------------------------------------------
class DBManager():

  # ------------------------------
  # Class Variable
  # ------------------------------
  DB_VENDOR = getenv('APP_DB')

  # ------------------------------
  # Decorate
  # ------------------------------
  # 共通処理
  def decoCommon(func):
    def wrapper(*args, **kwargs):
      try:
        return func(*args, **kwargs)

      except Exception as e:

        sql    = args[1]
        params = args[2]
        userid = (lambda tpl: tpl[3] if len(tpl) > 3 else '')(args)

        sql_param = tuple(map(lambda val: f"'{val}'", list(params)))
        print(f'[SQL] ({userid}): {sql}' % sql_param)
        raise e

    return wrapper

  # ------------------------------
  # Class Method
  # ------------------------------
  @classmethod
  def __config(cls):
    # NOTE: DBの複数ベンダーに対応するときは、ここでベンダーごとのクラスを切換すること。
    return PostgreSQL()

  @classmethod
  @decoCommon
  def select(cls, sql, tp_param):
    return DBManager.__config().select(sql, tp_param)
     
  @classmethod
  @decoCommon
  def insert(cls, sql, tp_param, userid):
    return DBManager.__config().insert(sql, tp_param, userid)

  @classmethod
  @decoCommon
  def update(cls, sql, tp_param, userid):
    return DBManager.__config().update(sql, tp_param, userid)

  @classmethod
  @decoCommon
  def delete(cls, sql, tp_param, userid):
    return DBManager.__config().delete(sql, tp_param, userid)

