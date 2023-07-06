
document.addEventListener('script1Completed', function() {

    // Sample data for disjoint graph
    let data = window.data;

    console.log(data);

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    // Set up the dimensions of the graph
    const width = 500;
    const height = 400;

    // Create an SVG container
    const svg = d3.select("#graphContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    svg.style("border", "2px solid #000");
    svg.style("border-radius", "5px");

    // Create a force simulation
    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", d => Math.sqrt(d.value));

    // Create nodes
    const node = svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", d => d.color);

    // Add labels to nodes
    const labels = svg.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text(d => d.id)
    .attr("text-anchor", "middle")
    .attr("dy", "-0.25em")
    .attr("fill", "#FBFAF5")
    .attr("font-size", "10px")
    .attr("pointer-events", "none");

    // Define tick function for simulation
    const tick = () => {
    link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

    node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

    labels
    .attr("x", d => d.x)
    .attr("y", d => d.y);
    };

    // Run the simulation and update the graph on each tick
    simulation.on("tick", tick);

    node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

    function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
    }
  
})


