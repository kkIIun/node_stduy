const fs = require("fs");

setInterval(() => {
  fs.unlink("./asd.js", (err) => {
    if (err) {
      console.log(err);
    }
  });
}, 1000);
