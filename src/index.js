import * as d3 from 'd3';
import parse from './parse';
import SchemaRenderer from './render';

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
        Promise.resolve(parseAndRender('schema.csv'));
      },
    );
}

async function parseAndRender(csvFileName) {
  const records = await d3.csv(csvFileName);
  const data = parse(records);
  const renderer = new SchemaRenderer(data);
  renderer.render();
}
