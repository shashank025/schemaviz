import parse from "../parse";

test("parse returns empty map when input is empty", () => {
  expect(parse([])).toStrictEqual({ nodes: [], links: [] });
});

test("parse when input is just one edge and one record", () => {
  expect(parse([{ source: "team", target: "player" }])).toStrictEqual({
    nodes: [
      { name: "team", edges: 1 },
      { name: "player", edges: 1 },
    ],
    links: [{ source: "team", target: "player" }],
  });
});

test("parse when input is just one edge, but two records", () => {
  expect(
    parse([{ source: "team", target: "player" }, { source: "player" }])
  ).toStrictEqual({
    nodes: [
      { name: "team", edges: 1 },
      { name: "player", edges: 1 },
    ],
    links: [{ source: "team", target: "player" }],
  });
});

test("parse when input is a chain of dependencies", () => {
  expect(
    parse([
      { source: "team", target: "player" },
      { source: "league", target: "team" },
    ])
  ).toStrictEqual({
    nodes: [
      { name: "team", edges: 2 },
      { name: "player", edges: 1 },
      { name: "league", edges: 1 },
    ],
    links: [
      { source: "team", target: "player" },
      { source: "league", target: "team" },
    ],
  });
});
