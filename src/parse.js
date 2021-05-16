/**
 * Parses the provided CSV records into structure suitable for rendering.
 *
 * The records are assumed to be generated via:
 *     records = await d3.csv(csvFileName);
 */
const parse = (records) => {
  const nodes = {};
  const links = [];
  records.forEach((record) => {
    const {
      source, target,
    } = record;
    if (!nodes[source]) {
      nodes[source] = {
        name: source,
        edges: 0,
      };
    }
    if (!target) {
      return;
    }
    if (!nodes[target]) {
      nodes[target] = {
        name: target,
        edges: 0,
      };
    }
    links.push(record);
    // increment edge count on both source and target nodes
    nodes[source].edges += 1;
    nodes[target].edges += 1;
  });
  return {
    nodes: Object.values(nodes),
    links,
  };
};

export default parse;
