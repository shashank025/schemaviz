import psycopg

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    "http://localhost:8080",
]

DEPENDENCY_SELECTION_QUERY = """
SELECT DISTINCT
    srel.relname AS source,
    trel.relname AS target,
    snsp.nspname AS source_schema,
    tnsp.nspname AS target_schema
  FROM pg_class srel
  JOIN pg_namespace snsp ON (
    snsp.oid = srel.relnamespace)
  LEFT JOIN pg_constraint s ON (
    s.conrelid = srel.oid and s.contype = 'f')
  LEFT JOIN pg_class trel ON (
    trel.oid = s.confrelid)
  LEFT JOIN pg_namespace tnsp ON (
    tnsp.oid = trel.relnamespace)
  WHERE srel.relkind = 'r'
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
            return dict(dependencies=[dict(
                source=s,
                target=t,
                source_schema=sn,
                target_schema=tn)
                for s, t, sn, tn in cursor])
