let shortPathAble = true;

function findShortestPath(adjacencyList, startNode, endNode) {
  const queue = [startNode];
  const visited = new Set();
  const predecessors = {};

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (currentNode === endNode) {
      const path = [];
      let node = currentNode;
      while (node !== startNode) {
        path.unshift(node);
        node = predecessors[node];
      }
      path.unshift(startNode);
      return path;
    }

    visited.add(currentNode);
    try {
    const neighbors = adjacencyList[currentNode];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        predecessors[neighbor] = currentNode;
      }
    }
    }
    catch(error){
      shortPathAble = false;
    }
  }

  return [];
}


document.addEventListener('readyforpathing', function() {
  data = window.data

  const pathlinks = data.links;
  
  adjacencyList = {};
  for (const key in pathlinks) {
    const { source, target } = pathlinks[key];
  
    if (!adjacencyList[source]) {
      adjacencyList[source] = [];
    }
    if (!adjacencyList[target]) {
      adjacencyList[target] = [];
    }
  
    adjacencyList[source].push(target);
    adjacencyList[target].push(source);
  }

  const connectionsCount = {};
  for (const person in adjacencyList) {
    const connections = adjacencyList[person];
    connectionsCount[person] = connections.length;
  }
  
  const sortedConnections = Object.entries(connectionsCount).sort((a, b) => b[1] - a[1]);
  
  const groups = [];
  let currentPlace = 1;
  let currentCount = sortedConnections[0][1];
  
  for (const [person, count] of sortedConnections) {
    if (count === currentCount) {
      groups[currentPlace - 1] = groups[currentPlace - 1] || [];
      groups[currentPlace - 1].push(`${person} - ${count}`);
    } else {
      currentPlace++;
      currentCount = count;
      groups[currentPlace - 1] = [`${person} - ${count}`];
    }
  }
  
  const leaderboardDiv = document.getElementById('linkleaderboard');
  leaderboardDiv.replaceChildren()

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const listElement = document.createElement('li');
    listElement.textContent = group.join(', ');
  
    if (i === 0) {
      listElement.id = 'firstplace';
    } else if (i === 1) {
      listElement.id = 'secondplace';
    } else if (i === 2) {
      listElement.id = 'thirdplace';
    } else if (i === groups.length - 1) {
      listElement.id = 'lastplace';
    }
  
    leaderboardDiv.appendChild(listElement);
  }

  let peopleDiv = document.getElementById("people");
      peopleDiv.replaceChildren();

  for (const key in adjacencyList) {
        const listItem = document.createElement('li');
        listItem.textContent = key;
        peopleDiv.appendChild(listItem);
      }

  const input1 = document.getElementById('input1');
  const input2 = document.getElementById('input2');
  const submitBtn = document.getElementById('submitBtn');

  const frenpath = document.getElementById("frenpath");

  submitBtn.addEventListener('click', function() {
    const startNode = input1.value;
    const endNode = input2.value;
    
    const shortestPath = findShortestPath(adjacencyList, startNode, endNode);

    var shortestPathString = ""
    for (let i = 0; i < shortestPath.length; i++) {
      if (shortestPath[i] != endNode){
        shortestPathString = shortestPathString + shortestPath[i] + "→"
      }
      else {
        shortestPathString = shortestPathString + shortestPath[i]
      }
    }
    

    if (shortestPathString != "" || shortPathAble) {
      frenpath.innerHTML = "Frenpath: <br>" + shortestPathString;
    }
    else {
      frenpath.innerHTML = "No path found! Please check whether you typed it correctly."
    }
  });
  })