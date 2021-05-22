import * as d3 from "d3";

// avoid divide-by-zero errors
const EPSILON = 0.000001;
// circle dimensions
const MIN_RADIUS = 5;
const MAX_RADIUS = 20;

class SchemaRenderer {
  constructor(data) {
    this.nodes = data.nodes;
    this.links = data.links;
  }

  render() {
    const simulation = d3
      .forceSimulation(this.nodes)
      .force(
        "link",
        d3
          .forceLink(this.links)
          .id(d => d.name)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-250));

    const svg = d3.select("svg");

    // build the arrow.
    svg
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

    // add the links and the arrows
    const path = svg
      .append("svg:g")
      .selectAll("path")
      .data(this.links)
      .join("svg:path")
      .attr("class", "link")
      .attr("marker-end", "url(#end)");

    const node = svg
      .selectAll(".node")
      .data(this.nodes)
      .join("g")
      .attr("class", "node")
      .call(drag(simulation));

    const rscale = d3
      .scaleLinear()
      .domain([0, d3.max(this.nodes, d => d.edges)])
      .range([MIN_RADIUS, MAX_RADIUS]);

    // add the nodes
    node.append("circle").attr("r", d => rscale(d.edges));

    // add the text
    node
      .append("text")
      .attr("x", d => rscale(d.edges) + 3)
      .attr("dy", ".35em")
      .text(d => d.name);

    simulation.on("tick", () => {
      path.attr("d", d => {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        const n = rscale(d.target.edges); // radius of target circle
        const k = n / (r + EPSILON); // multiplier
        const x2 = (1 - k) * d.target.x + k * d.source.x;
        const y2 = (1 - k) * d.target.y + k * d.source.y;
        return `M${d.source.x},${d.source.y} A${r},${r} 0 0,1 ${x2},${y2}`;
      });

      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });
  }
}

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
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
