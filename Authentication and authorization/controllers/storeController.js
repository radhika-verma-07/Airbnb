const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  console.log("Session value:", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Airbnb Home",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user
  });
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user.id;
  const user = await User.findById(userId).populate('favorites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favorites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user.id;
  const user = await User.findById(userId);
  if (!user.favorites.includes(homeId)) {
    user.favorites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user.id;
  const user = await User.findById(userId);
  if (user.favorites.includes(homeId)) {
    user.favorites = user.favorites.filter((fav) => fav.toString() !== homeId.toString());
    await user.save();
  }
  res.redirect("/favourites");
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
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user
      });
    }
  });
};
