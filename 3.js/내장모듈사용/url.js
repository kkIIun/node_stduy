const url = require("url");

const { URL } = url;
const myURL = new URL("https://www.solved.ac/profile/rlwjd4177");
console.log("new URL():", myURL);
console.log("url.format()", url.format(myURL));
console.log("--------------------");
const parsedUrl = url.parse("https://www.solved.ac/profile/rlwjd4177");
console.log("url.parse():", parsedUrl);
console.log("url.format()", url.format(parsedUrl));
