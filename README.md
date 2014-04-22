schemaviz
=========

Visualize foreign key relationships (and more) between the tables in your database schema using d3.js.

We use d3's force directed layout schema to produce an SVG image where each relation (table) in your schema is rendered as a node. A directed edge is added from node A to node B if some column(s) in A refer(s) to some column(s) in B:

    A -> B ==> Some columns in table A refer to some columns in table B.

#H2 1. Collect Schema Information

In order for schemaviz to do its thing, you need to tell schemaviz what your schema looks like. Use the provided [schema.csv](schema.csv) file for this purpose. This file should contain comma-separated records of the form:

    source,target

with the semantic that some columns in table `source` refer to some columns in table `target`. The exact mechanism for populating schema.csv depends on the database system you are using.

#H3 postgres

We assume that the tables you are interested in reside in the `public` schema of your postgres database. Roughly speaking, the following query returns the list of tables in the public schema, along with the tables that each of these tables refers to:

```sql

    SELECT
        c1.relname AS source, c2.relname AS target
      FROM pg_class c1
      JOIN pg_namespace n ON (n.oid = c1.relnamespace)
      LEFT JOIN pg_constraint s ON (s.conrelid = c1.oid and s.contype = 'f')
      LEFT JOIN pg_class c2 ON (c2.oid = s.confrelid)
     WHERE c1.relkind = 'r'
       AND n.nspname = 'public'
```

In conjunction with the `\copy` command, this can be used to easily populate the schema command. Run the following `psql` command in this directory to populate schema.csv from a postgres database of your choice:

    psql "dbname=xxx host=xxx.com user=xxx password=xxx port=xxx ..." -f pgschema.sql

#H3 mysql

TODO

#H2 2. Initialize visualization

The simplest way to get things up and running is to start a HTTP server in this directory. Running the following command:

     python -m SimpleHTTPServer 5009 &

will start up a HTTP server from which you can access the visualization by pointing your browser at the following url:

     http://localhost:5009/index.html

Note that the `index.html` suffix is optional. You can modify any parameters of your visualization by editing `index.html` directly.

