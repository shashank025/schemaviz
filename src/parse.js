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
    if (target) {
      if (!nodes[target]) {
        nodes[target] = {
          name: target,
          edges: 0,
        };
      }
      // create link
      const link = {
        source: nodes[source],
        target: nodes[target],
      };
      link.source.edges += 1;
      link.target.edges += 1;
      links.push(link);
    }
  });
  return {
    nodes: Object.values(nodes),
    links,
  };
};

export default parse;
