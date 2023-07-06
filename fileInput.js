// script1.js


const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const fileContent = event.target.result;
    // Call the function to convert the file content to JSON
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
        break; // Exit the loop when encountering the "Links:" section
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
          value: 2 // You can set the value as per your requirement
        };
        links.push(link);
      }
    }
  
    const jsonData = {
      nodes: nodes,
      links: links
    };
  
    // Convert the JSON data to a string
    const jsonString = JSON.stringify(jsonData);
  
    // Save the JSON string as a .json file
    saveJSON(jsonString);
  }
  
  
  function saveJSON(jsonString) {
    // Convert the JSON string to a Blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    /*
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create a link element to download the JSON file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
  
    // Append the link to the document body and simulate a click to trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    */
  
    // Store the data globally for access by other scripts
    window.data = JSON.parse(jsonString);
  
    // Create and dispatch a custom event to signal completion
    const event = new Event('script1Completed');
    document.dispatchEvent(event);
  }
  
