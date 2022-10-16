import * as d3 from "d3";

// avoid divide-by-zero errors
const EPSILON = 0.000001;
// circle dimensions
const MIN_RADIUS = 5;
const MAX_RADIUS = 20;
const ALPHA_TARGET = 0.3;

class SchemaRenderer {
  constructor(initialCharge, initialLinkDistance) {
    this.charge = parseInt(initialCharge, 10);
    this.linkDistance = parseInt(initialLinkDistance, 10);
    this.svg = getSvg();
  }

  setCharge(newCharge) {
    this.charge = parseInt(newCharge, 10);
  }

  setLinkDistance(newLinkDistance) {
    this.linkDistance = parseInt(newLinkDistance, 10);
  }

  render({ nodes, links }) {
    // Clear svg content before adding new elements
    this.svg.selectAll("*").remove();

    // used to determine node radius, and arc dimensions
    const rscale = d3
      .scaleLinear()
      .domain([0, d3.max(nodes, n => n.edges)])
      .range([MIN_RADIUS, MAX_RADIUS]);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .distance(this.linkDistance)
          .id(d => d.name)
      )
      .force("charge", d3.forceManyBody().strength(this.charge))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // build the arrow.
    this.svg
      .append("svg:defs")
      .selectAll("marker")
      .data(["end"])
      .join("svg:marker")
      .attr("id", String)
      .attr("refX", 5)
      .attr("refY", 3)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,0 L0,6 L6,3 Z");

    // each dependency between tables
    const path = this.svg
      .append("svg:g")
      .selectAll("path")
      .data(links)
      .join("svg:path")
      .attr("class", "link")
      .attr("marker-end", "url(#end)");

    // each database table
    const node = this.svg
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(drag(simulation));

    // add the nodes
    node.append("circle").attr("r", d => rscale(d.edges));
    // show name as text on hover
    node.append("title").text(d => d.name);

    simulation.on("tick", () => {
      path.attr("d", d => linkArc(d, rscale));
      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });
  }
}

function getSvg() {
  const svg = d3.select("svg");
  const { width, height } = svg.node().getBoundingClientRect();
  svg.attr("viewBox", [-width / 2, -height / 2, width, height]);
  return svg;
}

function linkArc(d, rscale) {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  const n = rscale(d.target.edges); // radius of target circle
  const k = n / (r + EPSILON); // multiplier
  const x2 = (1 - k) * d.target.x + k * d.source.x;
  const y2 = (1 - k) * d.target.y + k * d.source.y;
  return `M${d.source.x},${d.source.y} A${r},${r} 0 0,1 ${x2},${y2}`;
}

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(ALPHA_TARGET).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

export default SchemaRenderer;
