const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const fileContent = event.target.result;
    convertToJSON(fileContent);
  };

  reader.readAsText(file);
}

function convertToJSON(fileContent) {
    const lines = fileContent.split("\n");
    const nodes = [];
    const links = [];
    let currentGroup = "";
    let currentColor = "";
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      if (line.startsWith("Group")) {
        const groupInfo = line.split(" - ");
        currentGroup = groupInfo[0].replace(":", "").trim();
        currentColor = groupInfo[1].replace(":", "").trim();
      } else if (line === "Links:") {
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
  
    for (let i = lines.indexOf("Links:") + 1; i < lines.length; i++) {
      const line = lines[i].trim();
  
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
  
  
  function saveJSON(jsonString) {
    window.data = JSON.parse(jsonString);
    const event = new Event('script1Completed');
    document.dispatchEvent(event);

    /*
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
  
