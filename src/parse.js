/**
 * Parses the provided CSV records into structure suitable for rendering.
 * Each record is a map of the form { source: xxx, target: yyy }, assumed
 * to be generated via:
 *     records = await d3.csv(csvFileName);
 *
 * The output is a map of the form:
 *
 * {
 *    nodes: [{ name: xxx, edges: 1}, { name: yyy, edges: 1}, ...],
 *    links: [{ source: xxx, target: yyy }, ...]
 * }
 */
const parse = records => {
  const nodes = {};
  const links = [];
  // a multi-level Map structure of the form:
  // { source => Set(targets) }
  const seen = new Map();
  records.forEach(record => {
    const { source, target } = record;
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

    // at this point, both source and target are non-empty
    let targets = seen.get(source);
    if (!targets) {
      // first time this source has been seen: initialize!
      targets = new Set();
      seen.set(source, targets);
    }

    // only add source/target to links if not seen before
    if (!targets.has(target)) {
      targets.add(target);
      nodes[source].edges += 1;
      nodes[target].edges += 1;
      links.push(record);
    }
  });
  return {
    nodes: Object.values(nodes),
    links,
  };
};

export default parse;
