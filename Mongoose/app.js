//Core Module
const path = require("path");
//External Module
const express = require("express");

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const {default: mongoose} =  require('mongoose');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded());
app.use(storeRouter);
app.use("/host", hostRouter);
app.use(express.static(path.join(rootDir, "public")));

app.use(errorsController.pageNotFound);

const PORT = 3000;
const DB_PATH = "mongodb+srv://vermaradhika071207_db_user:pass_071207@test-cluster.ijbtrjl.mongodb.net/airbnb?appName=test-cluster";

mongoose.connect(DB_PATH).then(() => {
  console.log("Connected to mongo");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connnecting to Mongo:', err);
});
