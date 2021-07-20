const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const nunjucks = require("nunjucks");

dotenv.config();
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");

nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    morgan("combined")(req, res, next);
  } else {
    morgan("dev")(req, res, next);
  }
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
try {
  fs.readdirSync("uploads");
} catch (err) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, res, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { filesize: 5 * 1024 * 1024 },
});
app.get("/upload", (req, res) => {
  // res.sendFile(path.join(__dirname, "multipart.html"));
  res.render('multipart');
});
app.post(
  "/upload",
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  (req, res) => {
    console.log(req.files, req.body);
    res.send("ok");
  }
);

app.use("/", indexRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((req, res, next) => {
  console.log(req.cookies);
  res.cookie("name", "leekijung", {
    expires: new Date(Date.now() + 9000000),
    httpOnly: true,
    secure: true,
  });
  res.clearCookie("name", "leekijung", { httpOnly: true, secure: true });
  console.log("모든 요청에 다 실행됩니다");
  next();
});

app.get(
  "/",
  (req, res, next) => {
    //   res.send("hello, express");
    //   res.sendfile(path.join(__dirname, "./index.html"));
    console.log("GET / 요청에서만 처리됩니다.");
    req.data = "에러발생 에러발생";
    next();
  },
  (req, res, next) => {
    // throw new Error("에러는 에러 처리 미들웨어로 갑니다.");
    next(req.data);
  }
);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
  res.status(err.status || 500);
  res.render('error')
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
