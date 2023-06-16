import { sortNumber, sortString } from "./sorting.js";

function generateData() {
	const rand = Math.floor(Math.random() * 1000);
	return [
		{ name: "aris" + rand.toString(), lastName: "o", age: 12 },
		{ name: "bob", lastName: "n", age: 1 },
		{ name: "corio", lastName: "m", age: 13 },
		{ name: "drico", lastName: "l", age: 21 },
		{ name: "elio", lastName: "k", age: 2 },
		{ name: "fred", lastName: "j", age: 124 },
        { name: "greg", lastName: "j", age: 14 },
        { name: "haris", lastName: "j", age: 424 },
        { name: "ines", lastName: "j", age: 42 },
        { name: "joa", lastName: "j", age: 34 },
        { name: "karim", lastName: "j", age: 14 },
        { name: "liam", lastName: "j", age: 24 },
        { name: "nono", lastName: "j", age: 74 }
	];
}


export function getAll(text) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(generateData());
    }, 500);
  });
}

export function getData(page, pageSize, text, sorting) {
  let originalData = generateData();

  if (sorting) {
    if (sorting.key === "age") {
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

      resolve({ rows: rows.slice(0, pageSize), rowsCount: rowsCount - 1 });
    }, 500);
  });
}
