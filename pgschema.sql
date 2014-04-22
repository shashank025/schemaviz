COPY (
    SELECT
        c1.relname AS source, c2.relname AS target
      FROM pg_class c1
      JOIN pg_namespace n ON (n.oid = c1.relnamespace)
      LEFT JOIN pg_constraint s ON (s.conrelid = c1.oid and s.contype = 'f')
      LEFT JOIN pg_class c2 ON (c2.oid = s.confrelid)
     WHERE c1.relkind = 'r'
       AND n.nspname = 'public' ) TO STDOUT csv header
