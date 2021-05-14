schemaviz
=========

Visually represent every table in your database schema, and the foreign key relationships (and more) between these tables, using [d3.js](http://d3js.org/ "d3.js home page").

# 0. If You're in A Hurry

**Prerequisite:** **Yarn** (installation instructions)

The quickest way to get things up and running is to clone this repository, and start an HTTP server in the repository directory:

```
$ git clone https://github.com/shashank025/schemaviz.git
$ cd schemaviz/
$ yarn start
```

You can access the visualization with the provided default schema by pointing your browser at the following url:

```
http://localhost:8080/
```

You can also see an example at the [Schemaviz Github project page](http://shashank025.github.io/schemaviz/).

# 1. HOWTO

We use d3's [force directed layout scheme](https://github.com/mbostock/d3/wiki/Force-Layout) to produce an SVG image where each relation (table) in your schema is rendered as a node. A directed edge is added from node A to node B if some columns in A refer to some columns in B:

```
    A ---> B
```


Use the provided [schema.csv](schema.csv) file to tell schemaviz what your schema looks like. This file should contain comma-separated records of the form:

```
source,target
```
meaning that some columns in table `source` refer to some columns in table `target` via a [foreign key constraint](http://en.wikipedia.org/wiki/Foreign_key). Note that the `target` column can be `NULL`, since there can exist tables that don't refer to other tables. But the `source` column will always be non-null. The exact mechanism for populating schema.csv depends on the database system you are using.

## 1.1 postgres

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

In conjunction with the `\copy` command, this can be used to easily populate the schema csv file. For your convenience, this library includes a file, [pgschema.sql](pgschema.sql), which does exactly this.  Run the following `psql` command in this directory to populate [schema.csv](schema.csv) from a postgres database of your choice:

```
$ psql "dbname=xxx host=xxx.com ..." -f pgschema.sql -qX > schema.csv
```

## 1.2 mysql

TODO

Once you populate schema.csv to your satisfaction, you can follow the steps described above to start an HTTP server that visualizes your schema.


# 2. Improvements (for large graphs)

A good visualization is particularly useful when the underlying database schema is pretty large (1000+ tables). But it is not straightforward to render the force directed layout for a graph that large. Here are some ideas to make the visualization more useful:

1. Ability to search for and highlight a given table in the schema.
1. Expose the parameters of the force directed layout: `height`, `width`, `linkDistance`, `charge`, `gravity`, etc.
1. Vertical/horizontal scrolling through the rendered SVG.
1. [Fisheye distortion](http://bost.ocks.org/mike/fisheye/) to focus on a particular area of the graph.
