const http = require("http");
const fs = require("fs").promises;

const users = {};

http
  .createServer(async (req, res) => {
    try {
      console.log(req.method, req.url);
      if (req.method == "GET") {
        if (req.url == "/") {
          const data = await fs.readFile("./restFront.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url == "/about") {
          const data = await fs.readFile("./about.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(data);
        } else if (req.url == "/users") {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          return res.end(JSON.stringify(users));
        }
        try {
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (err) {}
      } else if (req.method == "POST") {
        if (req.url == "/user/") {
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("POST 본문(body):", body);
            const { name } = JSON.parse(body);
            const id = Date.now();
            users[id] = name;
            res.writeHead(201);
            res.end("등록 성공");
          });
        }
      } else if (req.method == "PUT") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          return req.on("end", () => {
            console.log("PUT 본문(body):", body);
            users[key] = JSON.parse(body).name;
            res.writeHead(204);
            res.end(JSON.stringify(users));
          });
        }
      } else if (req.method == "DELETE") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          delete users[key];
          res.writeHead(204);
          return res.end(JSON.stringify(users));
        }
      }
      res.writeHead(404);
      return res.end("Not Found");
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end(err.message);
      console.error(err);
    }
  })
  .listen(8080, () => {
    console.log("8080번 포트에서 대기 중입니다.");
  });
