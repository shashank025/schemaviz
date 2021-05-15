import * as d3 from 'd3';

// avoid divide-by-zero errors
const EPSILON = 0.000001;
// render area dimensions
const WIDTH = 1500;
const HEIGHT = 1500;
// circle dimensions
const MIN_RADIUS = 5;
const MAX_RADIUS = 20;

// entry-point
// eslint-disable-next-line no-use-before-define
main();

function main() {
  document
    .querySelector('#myBtn')
    .addEventListener(
      'click',
      // eslint-disable-next-line no-unused-vars
      (e) => {
        // eslint-disable-next-line no-use-before-define
        renderSchemaFromCsv('schema.csv');
      },
    );
}

function renderSchemaFromCsv(csvFileName) {
  const nodes = {};
  const links = [];
  d3.csv(
    csvFileName,
    (record) => {
      // eslint-disable-next-line no-console
      console.log(record);
      // create node(s)
      if (!nodes[record.source]) {
        nodes[record.source] = {
          name: record.source,
          edges: 0,
        };
      }
      if (record.target) {
        if (!nodes[record.target]) {
          nodes[record.target] = {
            name: record.target,
            edges: 0,
          };
        }
        // create link
        const link = {
          source: nodes[record.source],
          target: nodes[record.target],
        };
        link.source.edges += 1;
        link.target.edges += 1;
        links.push(link);
      }
    },
  ).then(
    // eslint-disable-next-line no-unused-vars
    (rows) => {
      // eslint-disable-next-line no-console
      console.log(nodes);
      // eslint-disable-next-line no-console
      console.log(links);
      // eslint-disable-next-line no-use-before-define
      renderSchemaForData(nodes, links);
    },
  );
}

function renderSchemaForData(nodes, links) {
  // TODO!
}
