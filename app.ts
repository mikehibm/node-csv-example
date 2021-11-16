import express, { NextFunction, Request, Response } from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import db from "./database";

// uncomment after placing your favicon in /public
// import favicon from "serve-favicon";

// DBにテーブルが無ければ作成する。
db.init();

const index = require("./routes/index");
const upload = require("./routes/upload");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/upload", upload);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found") as Error & { status: number };
  err.status = 404;
  next(err);
});

// error handler
app.use(function (
  err: Error & { status: number },
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
