# ------------------------------------------------------------------------------
# DB Connect & Transaction
# ------------------------------------------------------------------------------
from os          import getenv
from .postgresql import PostgreSQL

# ------------------------------------------------------------------------------
# DB Management Class
# ------------------------------------------------------------------------------
class DBManager():

  # ------------------------------
  # Class Variable
  # ------------------------------
  DB_VENDOR = getenv('APP_DB')

  # ------------------------------
  # Class Method
  # ------------------------------
  @classmethod
  def __config(cls):
    # NOTE: DBの複数ベンダーに対応するときは、ここでベンダーごとのクラスを切換すること。
    return PostgreSQL()

  # Create DataBase Class and return.
  @classmethod
  def select(cls, sql, tp_param):
    return DBManager.__config().select(sql, tp_param)
     
