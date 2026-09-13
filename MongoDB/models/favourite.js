const { getDb } = require("../utils/databaseUtil");

module.exports = class Favourite {
  constructor(houseId) {
    this.houseId = houseId;
  }

  save() {
    const db = getDb();
    return db.collection("favourites").findOne({ houseId: this.houseId }).then((existingFav) => {
        if (!existingFav) {
          return db.collection("favourites").insertOne(this);
        }
        return Promise.resolve();
      });
  }

  static getFavourites() {
    const db = getDb();
    console.log("Database name:", db.databaseName);
    return db
      .collection("favourites")
      .find({})
      .toArray()
      .then((favourites) => {
        console.log("FAVOURITES FROM DATABASE:", favourites);
        return favourites;
      });
  }

  static deleteById(delHomeId) {
    const db = getDb();
    return db.collection("favourites").deleteOne({ houseId: delHomeId });
  }
};
