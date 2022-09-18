const fs = require('fs');

fs.writeFile(process.env.DATA_DIR + "test.txt", "Hello me", (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });