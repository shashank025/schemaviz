schemaviz
=========

Visualize foreign key relationships (and more) between the tables in your database schema using d3.js.

Produces an SVG image where each relation (table) in your schema is rendered as a node.

    A -> B    => Some columns in table A refer to some columns in table B.

In other words, a directed edge is added from node A to node B if some column(s) in A refer(s) to some column(s) in B. We use d3's force directed layout schema.
