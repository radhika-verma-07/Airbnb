const Home = require("../models/home");
const Favourite = require("../models/favourite");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) =>
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Airbnb Home",
      currentPage: "index",
    }),
  );
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) =>
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
    }),
  );
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
  })
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites(favourites => {
  Home.find().then((registeredHomes) => {
      const favouriteHomes = registeredHomes.filter(home => favourites.includes());
      res.render("store/favourite-list", {
        favouriteHomes: favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    });
  });
};

exports.postAddToFavourite = (req, res, next) => {
  console.log("came to add to Favourite" , req.body);
  Favourite.addToFavourite(req.body.homeId, error => {
    if (error) {
      console.log("Error while marking as favourite:", error);
    }
  });
  res.redirect("/favourites");
}

exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.deleteById(homeId, error => {
    if (error) {
      console.log("Error while removing from favourites:", error);
    }
  });
  res.redirect("/favourites");
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home => {
    if (!home){
      console.log("Home not found.")
      res.redirect("/homes");
    }
    else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Details",
        currentPage: "Home",
      });
    }
  })
};


