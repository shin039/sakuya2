# ------------------------------------------------------------------------------
# DB Connect & Transaction For PostgreSQL
# ------------------------------------------------------------------------------
from os       import getenv
from psycopg2 import connect, extras

class PostgreSQL():

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
  # Select
  # ----------------------------------------------------------------------------
  def select(self, query, tp_param):

    db_url = self.__createConnectionURL()

    with connect(db_url) as conn:
      with conn.cursor(cursor_factory=extras.DictCursor) as cur:
        cur.execute(query, tp_param)
        results = cur.fetchall()

        dict_result = []
        for row in results:
          dict_result.append(dict(row))
        return dict_result


