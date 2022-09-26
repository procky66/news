const express = require("express");

const router = require("./routes/router");
const apiRouter = require("./routes/api.router");
const { handle400s, handle404s, handle500s } = require("./errors");

const app = express();
app.use(express.json());

app.use("/", router);
app.use("/api", apiRouter);

app.use(handle400s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
