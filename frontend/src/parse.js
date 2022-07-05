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
  // a Map of the form: source => Set(targets)
  const seen = new Map();
  const wasSeenBefore = (source, target) => {
    if (!seen.has(source)) {
      // first time this source has been seen: initialize!
      seen.set(source, new Set());
    }

    const targets = seen.get(source);
    if (targets.has(target)) {
      // this source/target combo was seen before!
      return true;
    }

    targets.add(target);
    return false;
  };

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

    if (wasSeenBefore(source, target)) {
      return;
    }

    nodes[source].edges += 1;
    nodes[target].edges += 1;
    links.push(record);
  });
  return {
    nodes: Object.values(nodes),
    links,
  };
};

export default parse;
