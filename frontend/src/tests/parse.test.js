import parse from "../parse";

test("parse returns empty map when input is empty", () => {
  expect(parse([])).toStrictEqual({ nodes: [], links: [] });
});

test("parse when input is just one edge and one record", () => {
  expect(
    parse([
      {
        source: "team",
        sourceSchema: "public",
        target: "player",
        targetSchema: "public",
      },
    ])
  ).toStrictEqual({
    nodes: [
      { fqn: "public.team", name: "team", schema: "public", edges: 1 },
      { fqn: "public.player", name: "player", schema: "public", edges: 1 },
    ],
    links: [{ source: "public.team", target: "public.player" }],
  });
});

test("parse when input is just one edge, but two records", () => {
  expect(
    parse([
      {
        source: "team",
        sourceSchema: "public",
        target: "player",
        targetSchema: "public",
      },
      {
        source: "team",
        sourceSchema: "public",
      },
    ])
  ).toStrictEqual({
    nodes: [
      { fqn: "public.team", name: "team", schema: "public", edges: 1 },
      { fqn: "public.player", name: "player", schema: "public", edges: 1 },
    ],
    links: [{ source: "public.team", target: "public.player" }],
  });
});

test("parse when input is a chain of dependencies", () => {
  expect(
    parse([
      {
        source: "team",
        sourceSchema: "public",
        target: "player",
        targetSchema: "public",
      },
      {
        source: "league",
        sourceSchema: "public",
        target: "team",
        targetSchema: "public",
      },
    ])
  ).toStrictEqual({
    nodes: [
      { fqn: "public.team", name: "team", schema: "public", edges: 2 },
      { fqn: "public.player", name: "player", schema: "public", edges: 1 },
      { fqn: "public.league", name: "league", schema: "public", edges: 1 },
    ],
    links: [
      { source: "public.team", target: "public.player" },
      { source: "public.league", target: "public.team" },
    ],
  });
});

test("parse when dupes in input", () => {
  expect(
    parse([
      {
        source: "team",
        sourceSchema: "public",
        target: "player",
        targetSchema: "public",
      },
      {
        source: "team",
        sourceSchema: "public",
        target: "player",
        targetSchema: "public",
      },
    ])
  ).toStrictEqual({
    nodes: [
      { fqn: "public.team", name: "team", schema: "public", edges: 1 },
      { fqn: "public.player", name: "player", schema: "public", edges: 1 },
    ],
    links: [{ source: "public.team", target: "public.player" }],
  });
});
