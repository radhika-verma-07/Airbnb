const Home = require("../models/home");
const Favourite = require("../models/favourite");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Airbnb Home",
      currentPage: "index",
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
  });
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites().then((favourites) => {

    const favouriteIds = favourites.map((fav) =>
      fav.houseId.toString()
    );

    Home.find().then((registeredHomes) => {

      const favouriteHomes = registeredHomes.filter((home) =>
        favouriteIds.includes(home._id.toString())
      );

      console.log("Favourite IDs:", favouriteIds);
      console.log("Registered Homes:", registeredHomes);
      console.log("Favourite Homes:", favouriteHomes);

      res.render("store/favourite-list", {
        favouriteHomes: favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    });
  });
};
exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id;
  console.log("Home ID received:", homeId);
  const fav = new Favourite(homeId);
  fav
    .save()
    .then((result) => {
      console.log("Fav added:", result);
    })
    .catch((err) => {
      console.log("Error while marking favourites:", err);
    })
    .finally(() => {
      res.redirect("/favourites");
    });
};

exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.deleteById(homeId)
    .then((result) => {
      console.log("Fav removed:", result);
    })
    .catch((err) => {
      console.log("Error while removing favourites:", err);
    })
    .finally(() => {
      res.redirect("/favourites");
    });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found.");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Details",
        currentPage: "Home",
      });
    }
  });
};
