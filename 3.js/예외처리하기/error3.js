const fs = require("fs").promises;

setInterval(() => {
  fs.unlink("./sdfasdf.js").catch((err) => {
    console.log("에러발견");
  });
}, 1000);
