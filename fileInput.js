
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileSelect, false);

function fileInputErrorDetected(){
  let graphDiv = document.getElementById("graph");
  graphDiv.replaceChildren();

  const graph1stDiv = document.createElement("div"); 
  const graphContainerDiv = document.createElement("div");
  graphContainerDiv.id = "graphContainer";
  const graphLegend = document.createElement("div");
  graphLegend.id = "legend";
  const graphTitle = document.createElement("h2");
  graphTitle.innerHTML = "Upload Error..."
  graphTitle.style.color = "#FBFAF5";
  graphTitle.id = "graphTitle";
  const graphLegendTitle = document.createElement("h3");
  graphLegendTitle.id = "legendtitle";
  graphContainerDiv.appendChild(graphTitle);
  graphLegend.appendChild(graphLegendTitle);
  const grapherrortext = document.createElement("p");
  grapherrortext.innerHTML = "Probably a formatting issue? Please check again. Alternatively check the console!"
  graphContainerDiv.appendChild(grapherrortext)

  graphDiv.appendChild(graph1stDiv);
  graphDiv.appendChild(graphContainerDiv);
  graphDiv.appendChild(graphLegend);

}

function handleFileSelect(event) {
  try {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const fileContent = event.target.result;
    window.filename = file.name.replace('.txt','');
    convertToJSON(fileContent);
  };

  reader.readAsText(file);
  }
  catch(error){
    fileInputErrorDetected()
  }
}

function convertToJSON(fileContent) {

  try {
    const lines = fileContent.split("\n");
    const nodes = [];
    const links = [];
    let currentGroup = "";
    let currentColor = "";
    var linkline = null;

    for (let i = 0; i < lines.length; i++) {
      var line = lines[i].trim();

      if (line.startsWith("Group")) {
        const groupInfo = line.split(" - ");
        currentGroup = groupInfo[0].replace("Group ","").trim();
        currentColor = groupInfo[1].replace(":", "").trim();
      } else if (line === "Links:") {
        linkline = i;
        break; 
      } else if (line !== "") {
        const personId = line;
        const node = {
          id: personId,
          group: currentGroup,
          color: currentColor
        };
        nodes.push(node);
      }
    }

    for (let i = linkline + 1; i < lines.length; i++) {
      var line = lines[i].trim();

      if (line !== "") {
        const linkInfo = line.split(" - ");
        const source = linkInfo[0].trim();
        const target = linkInfo[1].trim();
        const link = {
          source: source,
          target: target,
          value: 2 
        };
        links.push(link);
      }
    }

    const jsonData = {
      nodes: nodes,
      links: links
    };

    const jsonString = JSON.stringify(jsonData);
    saveJSON(jsonString);

  }
  catch(error){
    fileInputErrorDetected()
  }


}
  
  
function saveJSON(jsonString) {
  try{
    window.data = JSON.parse(jsonString);
    const event = new Event('script1Completed');
    document.dispatchEvent(event);
  }
  catch(error){
    fileInputErrorDetected()
  }
  /* this downloads the .json file
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'file.json';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
  */
}
