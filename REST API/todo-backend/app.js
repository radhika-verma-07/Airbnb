//Core Module
const path = require("path");
//External Module
const express = require("express");
const {default: mongoose} =  require('mongoose');
const cors = require("cors");
const DB_PATH = "mongodb+srv://vermaradhika071207_db_user:pass_071207@test-cluster.ijbtrjl.mongodb.net/todo?appName=test-cluster";

//Local Module
const todoItemsRouter = require("./routes/todoItemsRouter");
const errorsController = require("./controllers/errors");
const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.use("/api/todo", todoItemsRouter);

app.use(errorsController.pageNotFound);

const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
  console.log("Connected to mongo");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connnecting to Mongo:', err);
});
