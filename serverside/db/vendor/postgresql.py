# ------------------------------------------------------------------------------
# DB Connect & Transaction For PostgreSQL
# ------------------------------------------------------------------------------
from os        import getenv
from psycopg2  import connect, extras

from .i_dbvendor import I_DbVendor

class PostgreSQL(I_DbVendor):
  # ----------------------------------------------------------------------------
  # Create Connection URL
  # ----------------------------------------------------------------------------
  def __createConnectionURL(self):
    dbhost = getenv('APP_DB_HOST')
    dbport = getenv('APP_DB_PORT')
    dbuser = getenv('APP_DB_USER')
    dbpass = getenv('APP_DB_PASS')
    dbname = getenv('APP_DB_NAME')

    return f"postgresql://{dbuser}:{dbpass}@{dbhost}:{dbport}/{dbname}"

  # ----------------------------------------------------------------------------
  # Common Function
  # ----------------------------------------------------------------------------
  def __selectOne(self, query, tp_param):
    db_url  = self.__createConnectionURL()

    with connect(db_url) as conn:
      with conn.cursor(cursor_factory=extras.DictCursor) as cur:
        cur.execute(query, tp_param)
        
        results = cur.fetchall()

        dict_result = []
        for row in results:
          dict_result.append(dict(row))

        return dict_result

  # Open Connection, Cursor
  def __connect(self):
    db_url = self.__createConnectionURL()
    self.conn   = connect(db_url)
    self.cursol = self.conn.cursor(cursor_factory=extras.DictCursor)

  # Commit Transaction & Close Connection, Cursor
  def __close(self):
    self.conn.commit()
    self.cursol.close()
    self.conn.close()

  # Rollback transaction
  def __rollback(self):
    self.conn.rollback()

  # Transaction
  def __transaction(self, query, tp_param, staff_id, mode):
    try:
      self.__connect()
      self.cursol.execute(query, tp_param)
      self._insertTransactionlog(query, tp_param, staff_id, mode)
      return "EXECUTE_OK";

    except Exception as e:
      self.__rollback()
      raise e

    finally:
      self.__close()

  # ----------------------------------------------------------------------------
  #  Public Function
  # ----------------------------------------------------------------------------

  # - - - - - - - - - - - - - - - - - - 
  # Utility Method
  # - - - - - - - - - - - - - - - - - - 
  # Implementes Parent class
  def _insertTransactionlog(self, query, tp_param, staff_id, mode):
    tl_query  = '''Insert into t_transaction_log (
       process_date
      ,process_time
      ,staff_id
      ,kind
      ,process
    ) VALUES (now(), now(), %s, %s, %s)'''

    sql_param = tuple(map(lambda val: f"'{val}'", list(tp_param)))
    queryStr  = query % sql_param;
    self.cursol.execute(tl_query, (str(staff_id), str(mode), queryStr));

  # - - - - - - - - - - - - - - - - - - 
  # About SQL Query Method
  # - - - - - - - - - - - - - - - - - - 
  # select one & fetch all
  def select(self, query, tp_param):
    return self.__selectOne(query, tp_param)

  # insert one
  def insert(self, query, tp_param, staff_id):
    return self.__transaction(query, tp_param, staff_id, self.MODE_REGIST);

  # update one
  def update(self, query, tp_param, staff_id):
    return self.__transaction(query, tp_param, staff_id, self.MODE_UPDATE);

  # delete one
  def delete(self, query, tp_param, staff_id):
    return self.__transaction(query, tp_param, staff_id, self.MODE_DELETE);
