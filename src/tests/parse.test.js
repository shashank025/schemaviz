import parse from "../parse";

test("parse returns empty when input is empty", () => {
  expect(parse([])).toStrictEqual({ nodes: [], links: [] });
});
