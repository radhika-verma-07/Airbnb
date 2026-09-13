const mongo = require("mongodb");

const MongoClient = mongo.MongoClient;

const MONGO_URL =
  "mongodb+srv://vermaradhika071207_db_user:pass_071207@test-cluster.ijbtrjl.mongodb.net/airbnb?appName=test-cluster";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL)
    .then((client) => {
      _db = client.db('airbnb');
      callback();
    })
    .catch((err) => {
      console.log("Error while connecting to MongoDB:", err);
    });
};

const getDb = () => {
  if (!_db) {
    throw new Error("Mongo not connected");
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
