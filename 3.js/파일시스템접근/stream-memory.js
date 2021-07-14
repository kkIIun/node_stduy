const fs = require("fs");

console.log("before: ", process.memoryUsage().rss);

const writeStream = fs.createWriteStream("./big3.txt");
const readStream = fs.createReadStream("./big.txt");

readStream.pipe(writeStream);

readStream.on("end", () => {
  console.log("stream: ", process.memoryUsage().rss);
});
