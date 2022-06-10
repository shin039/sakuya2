# ------------------------------------------------------------------------------
# DB Connect & Transaction For PostgreSQL
# ------------------------------------------------------------------------------
from os                   import getenv
import psycopg2
import psycopg2.extras

class PostgreSQL():

  # ----------------------------------------------------------------------------
  # Create Connection URL
  # ----------------------------------------------------------------------------
  def createConnectionURL(self):
    dbhost = getenv('DB_HOST')
    dbport = getenv('DB_PORT')
    dbuser = getenv('DB_USER')
    dbpass = getenv('DB_PASS')
    dbname = getenv('DB_NAME')
    return f"postgresql://{dbuser}:{dbpass}@{dbhost}:{dbport}/{dbname}"

  # ----------------------------------------------------------------------------
  # Select
  # ----------------------------------------------------------------------------
  def select(self, query):

    db_url = self.createConnectionURL()

    with psycopg2.connect(db_url) as conn:
      with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(query)
        results = cur.fetchall()

        dict_result = []
        for row in results:
          dict_result.append(dict(row))
        return dict_result


