const fs = require("fs");

const readeStream = fs.createReadStream("./readme2.txt");
const writeStream = fs.createWriteStream("./write.txt");
readeStream.pipe(writeStream);
