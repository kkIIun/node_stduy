const fs = require("fs");

const writeStream = fs.createWriteStream("./write.txt");
writeStream.on("finish", () => {
  console.log("파일쓰기완료");
});

writeStream.write("이 글을 씁니다.\n");
writeStream.write("한 번 더 씁니다.");
writeStream.end();
