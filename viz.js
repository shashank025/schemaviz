// get the data
d3.csv("schema.csv", function(error, links) {

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        // link.source is guaranteed to be non-null
        nodes[link.source] || (nodes[link.source] = {name: link.source, edges: 0});
        if (link.target) {
            link.source = nodes[link.source];
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, edges: 0});
            link.source.edges += 1;
            link.target.edges += 1;
        }
    });

    // bounding box for the svg container
    var width = 2500,
    height = 2500;

    // circle radii
    var min_r = 5,
    max_r = 20;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(80)
        .charge(-500)
        .gravity(.20)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("refX", 5)
        .attr("refY", 3)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,0 L0,6 L6,3 Z");

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("marker-end", "url(#end)");

    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    var rscale = d3.scale.linear()
        .domain([0, d3.max( force.nodes(), function(d) { return d.edges; } )])
        .range([min_r, max_r]);

    // add the nodes
    node.append("circle")
        .attr("r", function(d) { return rscale(d.edges);} );

    // add the text 
    node.append("text")
        .attr("x", function(d) { return rscale(d.edges) + 3; })
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
            var n = rscale(d.target.edges),   // radius of target circle
            k = n / dr;                   // multiplier
            var x2 = (1 - k) * d.target.x + k * d.source.x;
            var y2 = (1 - k) * d.target.y + k * d.source.y;
            return "M" + 
                d.source.x + "," + 
                d.source.y + "A" + 
                dr + "," + dr + " 0 0,1 " + 
                x2 + "," + 
                y2;
        });

        node
            .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; });
    }

});
