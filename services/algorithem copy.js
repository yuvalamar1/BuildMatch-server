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
  for (let i = 0; i < 5; i++) {
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
    // Partition nodes into E_i, O_i, U_i
    for (let j = 0; j < edges.length; j++) {
      const valueExists = Array.from(M.values()).includes(edges[j].familyName);
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
    if (!newMatchings.has(edge.plot)) {
      let altpath = findaugmentingpath(newMatchings, edges, edge.plot);
      if (altpath.length > 0) {
        for (let node of altpath) {
          if (newMatchings.has(node)) {
            newMatchings.delete(node);
          }
        }
        for (let i = 0; i < altpath.length - 1; i += 2) {
          newMatchings.set(altpath[i], altpath[i + 1]);
        }
        return newMatchings;
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
  edges.forEach((edge) => {
    families.add(edge.familyName);
    plots.add(edge.plot);
  });
  matchings.forEach((value, key) => {
    nodesinmatch.push(key);
    nodesinmatch.push(value);
  });

  edges.forEach((edge) => {
    if (!nodesinmatch.includes(edge.familyName)) {
      exposenodes.add(edge.familyName);
    }
    if (!nodesinmatch.includes(edge.plot)) {
      exposenodes.add(edge.plot);
    }
  });
  //   plots.forEach((plot) => {
  //     if (!nodesinmatch.includes(plot)) {
  //       exposenodes.push(plot);
  //     }
  //   });
  edges.forEach((edge) => {
    if (edge.plot === start) {
      neighbors.push(edge.familyName);
    }
  });
  visited.push(start);
  for (let neighbor of neighbors) {
    if (nodesinmatch.includes(neighbor)) {
      visited.push(neighbor);
      let hismatch;
      for (let [key, value] of matchings) {
        if (value === neighbor) {
          hismatch = key;
          visited.push(key);
          break;
        }
      }
      for (let edge of edges) {
        if (edge.plot === hismatch && exposenodes.has(edge.familyName)) {
          visited.push(edge.familyName);
          return visited; // This will exit the function
        }
      }
    }
  }
  return [];
}

// function partitionNodes(M, edges) {
//   const E_i = new Set();
//   const O_i = new Set();
//   const U_i = new Set();

//   const visited = new Set();

//   const bfs = (family, even) => {
//     const queue = [[family, even]];
//     visited.add(family);

//     while (queue.length) {
//       const [currentFamily, isEven] = queue.shift();

//       for (const edge of edges || []) {
//         const plot = edge.plot;
//         if (!M.has(plot)) {
//           if (isEven) {
//             E_i.add(plot);
//           } else {
//             O_i.add(plot);
//           }
//         }

//         if (!visited.has(plot)) {
//           visited.add(plot);
//           queue.push([plot, !isEven]);
//         }
//       }
//     }
//   };

//   edges.forEach((_, family) => {
//     if (!visited.has(family)) {
//       bfs(family, true);
//     }
//   });
// }
// Example usage

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
