const XLSX = require("xlsx");
const fs = require("fs");

// Function to read Excel file and convert each row to an object
function readExcelFile(filePath) {
  // Read the Excel file
  const workbook = XLSX.readFile(filePath);

  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Return the list of objects
  const result = jsonData.map((row) => {
    let list = [];
    let familyName = "";
    for (const key in row) {
      if (key === "family name") {
        familyName = row[key];
      } else {
        list.push(row[key]);
      }
    }
    return {
      "family name": familyName,
      data: list,
    };
  });

  return result;
}

const rankMaximalMatching = (plotslist, preferencesList) => {
  let M = new Map(); // Start with an empty matching
  let familylist = [];
  let edges = [];
  let flag = true;
  let E_i = new Set();
  let O_i = new Set();
  let U_i = new Set();

  //create first matching
  preferencesList.map((preferences) => {
    familylist.push(preferences["family name"]);
    if (!M.has(preferences.data[0])) {
      M.set(preferences.data[0], preferences["family name"]);
    }
  });
  console.log("first matching");
  console.log(M);

  //run the algorithm for i to plotslist.length
  //   for (let i = 0; i <= plotslist.length; i++) {
  for (let i = 0; i < 4; i++) {
    //create edges with rank i
    preferencesList.forEach((preferences) => {
      if (
        !U_i.has(preferences.data[i]) &&
        !O_i.has(preferences.data[i]) &&
        !U_i.has(preferences["familyName"]) &&
        !O_i.has(preferences["familyName"]) &&
        preferences.data[i] !== undefined
      ) {
        edges.push({
          familyName: preferences["family name"],
          plot: preferences.data[i],
        });
      }
    });
    console.log("edges in iteration " + i);
    console.log(edges);
    //find maximal matching
    M = findMaximalMatching(M, edges); ///////////////////////////////////////////////////////////
    console.log("maximal matching in iteration " + i);
    console.log(M);
    E_i = new Set();
    O_i = new Set();
    U_i = new Set();
    // Partition nodes into E_i, O_i, U_i
    for (let j = 0; j < edges.length; j++) {
      const valueExists = Array.from(M.values()).includes(edges[j].familyName); //check if the family is already matched
      if (!valueExists) {
        let index = j;
        while (true) {
          E_i.add(edges[index].familyName);
          O_i.add(edges[index].plot);
          secondvertex = M.get(edges[index].plot); //get the family name of the plot in the matching
          if (
            secondvertex === undefined ||
            secondvertex === edges[index].familyName
          ) {
            break;
          }
          if (secondvertex) {
            index = edges.findIndex((edge) => edge.familyName === secondvertex);
          }
        }
      }
    }
    plotslist.forEach((plot) => {
      if (!M.has(plot) && !O_i.has(plot)) {
        E_i.add(plot);
      }
    });
    plotslist.forEach((plot) => {
      if (!E_i.has(plot) && !O_i.has(plot)) {
        U_i.add(plot);
      }
    });
    familylist.forEach((family) => {
      if (!E_i.has(family)) {
        U_i.add(family);
      }
    });
    console.log("E_i, O_i, U_i in iteration " + i);
    console.log(E_i);
    console.log(O_i);
    console.log(U_i);
  }
};

function findMaximalMatching(matchings, edges) {
  let newMatchings = new Map(matchings); // Copy the existing matchings
  for (let edge of edges) {
    if (edge.plot === 4) {
      console.log("edge 4");
    }
    // Iterate over the edges
    if (!newMatchings.has(edge.plot)) {
      // If the plot is not already matched
      const valueExists = Array.from(newMatchings.values()).includes(
        edge.familyName
      ); // Check if the family is already matched
      if (!valueExists) {
        newMatchings.set(edge.familyName, edge.plot); // if plot and family are not matched, add them to the matching
        break;
      }
      let altpath = findaugmentingpath(newMatchings, edges, edge.plot); // Find an augmenting path
      if (altpath.length > 0) {
        for (let node of altpath) {
          if (newMatchings.has(node)) {
            newMatchings.delete(node);
          }
        }
        for (let i = 0; i < altpath.length - 1; i += 2) {
          newMatchings.set(altpath[i], altpath[i + 1]);
        }
        // return newMatchings;
      }
    }
  }
  return newMatchings;
}

function findaugmentingpath(matchings, edges, start) {
  let visited = [];
  let neighbors = [];
  let families = new Set();
  let plots = new Set();
  let exposenodes = new Set();
  let nodesinmatch = [];

  // Create a set of all families and plots
  edges.forEach((edge) => {
    families.add(edge.familyName);
    plots.add(edge.plot);
  });

  // Create a list of nodes in the matching
  matchings.forEach((value, key) => {
    nodesinmatch.push(key);
    nodesinmatch.push(value);
  });

  // Create a set of nodes that are not in the matching
  edges.forEach((edge) => {
    if (!nodesinmatch.includes(edge.familyName)) {
      exposenodes.add(edge.familyName);
    }
    if (!nodesinmatch.includes(edge.plot)) {
      exposenodes.add(edge.plot);
    }
  });

  // Find the neighbors (family type) of the start node, the first node should be plot type
  edges.forEach((edge) => {
    if (edge.plot === start) {
      neighbors.push(edge.familyName);
    }
  });
  // Add the start node to the visited list
  visited.push(start);

  for (let neighbor of neighbors) {
    if (nodesinmatch.includes(neighbor)) {
      // If the neighbor (family) is in the matching
      //////////////////////////////////////////
      let addvisit = addtoaugmentingpath(matchings, edges, neighbor, visited); // Add the augmenting path to the visited list
      for (let node of addvisit) {
        visited.push(node);
      }
      console.log("visited in findaugmentingpath");
      console.log(visited);
      break;
      //////////////////////////////////////////
    }
  }
  return visited;
}

//this function get a family type node in the matching and try to find an augmenting path
function addtoaugmentingpath(matchings, edges, start, visited) {
  //start is a family node
  let newvisited = [];
  let hismatch;
  newvisited.push(start);

  // Find the matching node for the start node
  for (let [key, value] of matchings) {
    if (value === start) {
      hismatch = key;
      newvisited.push(key);
      break;
    }
  }
  // Find the neighbors {family type} of the matching node, the neighbors should be plot type
  let neighbors = [];
  for (let edge of edges) {
    if (edge.plot === hismatch) {
      //his match is a plot node
      neighbors.push(edge.familyName);
    }
  }
  // check if the neighbors are in the visited list and if the neighbor is in the matching, if so run the function again from the neighbor
  for (let neighbor of neighbors) {
    let flag = false;
    if (!visited.includes(neighbor) && !newvisited.includes(neighbor)) {
      for (let [key, value] of matchings) {
        if (flag) {
          break;
        }
        if (value === neighbor) {
          let addvisit = addtoaugmentingpath(
            matchings,
            edges,
            neighbor,
            newvisited
          ); // Add the augmenting path to the visited list
          if (addvisit.length === 0) {
            flag = true;
            continue;
          }
          for (let node of addvisit) {
            newvisited.push(node);
          }
          //   newvisited.push(
          //     addtoaugmentingpath(matchings, edges, value, newvisited)
          //   );
          break;
        }
      }
      if (flag) {
        continue;
      }
      if (!newvisited.includes(neighbor)) {
        newvisited.push(neighbor);
      }
      return newvisited;
    }
  }
  return [];
}

// Main code
const filePath = "./סימולציה ראשונה קמה_1.xlsx"; // Replace with the path to your Excel file
const data = readExcelFile(filePath);
const newplots = [];
for (let i = 1; i <= 36; i++) {
  newplots.push(i);
}

const plots = [1, 2, 3, 4, 5, 6];
const preferences = [
  {
    "family name": "aaa",
    data: [2, 1, 3, 5, 4],
  },
  {
    "family name": "bbb",
    data: [1, 2, 3, 4, 5],
  },
  {
    "family name": "ccc",
    data: [1, 2, 3, 4, 5],
  },
  {
    "family name": "dddd",
    data: [1, 2, 3, 4, 5],
  },
  {
    "family name": "eee",
    data: [2, 1, 3, 6, 4, 5],
  },
  {
    "family name": "fff",
    data: [6],
  },
];

rankMaximalMatching(plots, preferences);
// rankMaximalMatching(newplots, data);
