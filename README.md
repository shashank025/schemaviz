## Schemaviz

Visualize dependencies between the tables in your database.

### Architecture

This tool consists of a [frontend](frontend/), and a [backend](backend/):

- The backend is a Python-based service that can query a specified database to pull the database schema, and return dependency info in the form of a REST API.

- The frontend is a Node-based application that queries the backend and renders the database schema visually.

### Installation & Usage

Refer to the READMEs in the individual subfolders.
