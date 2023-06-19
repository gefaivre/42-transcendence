import { sortNumber, sortString } from "./sorting.js";
import axios from "../../axios.config";
let users = [];

function generateData() {
	// return [
	// 	{ name: "aris" + rand.toString(), last: "o", mmr: 12, okok: 10 },
	// 	{ name: "bob", last: "n", mmr: 1 },
	// 	{ name: "corio", last: "m", mmr: 13 },
	// 	{ name: "drico", last: "l", mmr: 21 },
	// 	{ name: "elio", last: "k", mmr: 2 },
	// 	{ name: "fred", last: "j", mmr: 124 },
  //       { name: "greg", last: "j", mmr: 14 },
  //       { name: "haris", last: "j", mmr: 424 },
  //       { name: "ines", last: "j", mmr: 42 },
  //       { name: "joa", last: "j", mmr: 34 },
  //       { name: "karim", last: "j", mmr: 14 },
  //       { name: "liam", last: "j", mmr: 24 },
  //       { name: "nono", last: "j", mmr: 74 }
	// ];
  return getUsers();
}

export async function getUsers() {
  try {
    const response = await axios.get("/users");
    return (response.data)
  } catch (e) {
    console.log(e);
  }
}

export function getAll(text) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(generateData());
    }, 500);
  });
}

export function getData(pmmr, pmmrSize, text, sorting) {
  let originalData = generateData();
  console.log("getting data");

  if (sorting) {
    if (sorting.key === "mmr") {
      
      originalData = sortNumber(originalData, sorting.dir, sorting.key);
    } else {
      originalData = sortString(originalData, sorting.dir, sorting.key);
    }
  }

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      let rowsCount = originalData.length;
      const originalRows = originalData;
      let rows = [];

      if (text && text.length > 0) {
        for (let i in originalRows) {
          for (let j in originalRows[i]) {
            if (
              originalRows[i][j]
                .toString()
                .toLowerCase()
                .indexOf(text) > -1
            ) {
              rows.push(originalRows[i]);
              break;
            }
          }
        }

        rowsCount = rows.length;
      } else {
        rows = originalRows;
      }

      resolve({ rows: rows.slice(0, pmmrSize), rowsCount: rowsCount - 1 });
    }, 500);
  });
}
