## Schemaviz

Visualize dependencies between the tables in your database.

### Prerequisites

1. The Node Package Manager (NPM)
2. Python (3.9 or newer)
3. Poetry (Python package manager)

### Installing

First, clone the repo locally:

```
$ git clone https://github.com/shashank025/schemaviz.git
```

Next, browse to the `frontend/` folder, and run `npm install`:

```
$ cd schemaviz/frontend
$ npm install
```

### Using this tool

In one terminal, start the Python backend:

```
$ cd schemaviz/backend
$ poetry run uvicorn schemaviz_backend.main:app --reload
```

In another terminal, start the frontend:

```
$ cd schemaviz/frontend
$ npm start
```

This will start a local webserver at http://localhost:8080/.

### Visualizing your schema

1. Navigate to the [local webserver](http://localhost:8080/)
   in your browser.
2. Enter the connection string for your database, and
3. Click "Visualize"

The web application should shortly display a directed graph
showing the tables in your database and the relationships
between them.

For example, when I point this tool
at the following publically available database:

```
postgres://reader:NWDMCE5xdipIjRrp@hh-pgsql-public.ebi.ac.uk:5432/pfmegrnargs
```

here's how the resulting visualization looks:

<img
  style="border: solid 2px gray;"
  src="frontend/docs/screenshot_localhost_example.png"
  alt="screenshot showing schemaviz interface on local webserver"
  width="80%" align="center" />

### Architecture

This tool consists of a [frontend](frontend/), and
a [backend](backend/):

- The backend is a Python-based API service that currently
  exposes just one API that lets you specify a database to
  connect to. This service connects to that database,
  queries its schema, and assembles dependency info to the
  API caller.

- The frontend is a Node-based web application that
  queries the backend and renders the database schema
  visually.

### Visualization Approach

We use d3's [force directed layout scheme](https://observablehq.com/@d3/mobile-patent-suits)
to produce an SVG image where each relation (table) in your
schema is rendered as a node. A directed edge is added
from node A to node B if some columns in A refer to some
columns in B, as expressed via a
[foreign key constraint](http://en.wikipedia.org/wiki/Foreign_key):

```
    A ---> B
```

### Improvements (for large graphs)

A good visualization is particularly useful when the underlying
database schema is pretty large (1000+ tables). But it is not
straightforward to render the force directed layout for a graph
that large. Here are some ideas to make the visualization more useful:

1. Ability to search for and highlight a given table in the schema.
1. Expose the parameters of the force directed layout: `height`, `width`, `linkDistance`, `charge`, `gravity`, etc.
1. Vertical/horizontal scrolling through the rendered SVG.
1. [Fisheye distortion](http://bost.ocks.org/mike/fisheye/) to focus on a particular area of the graph.
