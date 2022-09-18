const fs = require('fs');

fs.writeFile("../../dist/data/test.txt", "Hello me", (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });