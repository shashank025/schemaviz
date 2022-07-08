import psycopg

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    "http://localhost:8080",
]

DEPENDENCY_SELECTION_QUERY = """
SELECT DISTINCT
    c1.relname AS source, c2.relname AS target
  FROM pg_class c1
  JOIN pg_namespace n ON (n.oid = c1.relnamespace)
  LEFT JOIN pg_constraint s ON (s.conrelid = c1.oid and s.contype = 'f')
  LEFT JOIN pg_class c2 ON (c2.oid = s.confrelid)
  WHERE c1.relkind = 'r'
    AND n.nspname = 'rnacen'
"""

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {"Hello": "World"}


@app.get('/dependencies')
def get_dependencies(connection_uri):
    # TODO: add another param for the schema
    print(connection_uri)
    with psycopg.connect(connection_uri) as conn:
        with conn.cursor() as cursor:
            cursor.execute(DEPENDENCY_SELECTION_QUERY)
            print(cursor.rowcount)
            dependencies = {}
            return dict(dependencies=[dict(source=s, target=t)
                                      for s, t in cursor])
