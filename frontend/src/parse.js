/**
 * Parses the input into a structure suitable for rendering.
 *
 * Each input record is a map of the form:
 *   { source: xxx, source_schema: n, target: yyy, target_schema: t }.
 *
 * The output is a map of the form:
 *
 * {
 *    nodes: [
 *        { fqn: n.xxx, name: xxx, schema: n, edges: 1},
 *        { fqn: t.yyy, name: yyy, schema: t, edges: 1},
 *        ...
 *    ],
 *    links: [
 *        { source: n.xxx, target: t.yyy },
 *        ...
 *    ]
 * }
 *
 * The key "fqn" in the nodes element of the above map refers to
 * "fully qualified name", which refers to the combination of
 * the schema and the table name.
 */
const parse = records => {
  const nodes = {};
  const links = [];
  // a Map of the form: fqn => Set(target_fqns)
  const seen = new Map();
  // a helper method to detect and eliminate duplicate records in the input.
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

  records.forEach(({ source, sourceSchema, target, targetSchema }) => {
    const sourceFqn = `${sourceSchema}.${source}`;
    if (!nodes[sourceFqn]) {
      nodes[sourceFqn] = {
        fqn: sourceFqn,
        name: source,
        schema: sourceSchema,
        edges: 0,
      };
    }

    if (!target) {
      return;
    }

    // if target is present, it is assumed targetSchema is also present
    const targetFqn = `${targetSchema}.${target}`;

    if (!nodes[targetFqn]) {
      nodes[targetFqn] = {
        fqn: targetFqn,
        name: target,
        schema: targetSchema,
        edges: 0,
      };
    }

    if (wasSeenBefore(sourceFqn, targetFqn)) {
      return;
    }

    nodes[sourceFqn].edges += 1;
    nodes[targetFqn].edges += 1;
    links.push({ source: sourceFqn, target: targetFqn });
  });
  return {
    nodes: Object.values(nodes),
    links,
  };
};

export default parse;
