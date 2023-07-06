
document.addEventListener('script1Completed', function() {

    var graphTitle = document.getElementById("graphTitle");
    graphTitle.innerHTML = "Graph Title";
    graphTitle.style.color = "#FBFAF5";
    graphTitle.style.textAlign = "center";
    graphTitle.style.margin = "0";
    graphTitle.style.padding = "10px";

    let data = window.data;

    console.log(data);

    const links = data.links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));
    const groups = [...new Set(nodes.map(node => node.group))];
    console.log(groups)

    const width = 500;
    const height = 400;

    const svg = d3.select("#graphContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    svg.style("border", "2px solid #FBFAF5");
    svg.style("border-radius", "5px");

    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", d => d.color);

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

    const legend = d3.select("#legend");

    const legendtitle = document.getElementById("legendtitle");
    legendtitle.innerHTML = "Legend";
    legendtitle.style.color = "#FBFAF5";
    legendtitle.style.margin = "0";
    legendtitle.style.paddingBottom = "10px";

    const legendItems = legend.selectAll("#legend-item")
      .data(groups)
      .enter()
      .append("div")
      .attr("id", "legend-item");
    
    legendItems.append("span")
      .style("background-color", d => nodes.find(node => node.group === d).color)
      .attr("id", "legend-color");
    
    legendItems.append("span")
      .text(d => d)
      .attr("id", "legend-label");
  

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

    function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
    }

    function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
    }

    function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
    }

    function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
    }
})


