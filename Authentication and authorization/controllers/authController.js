const { check, validationResult } = require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {}
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {firstName: "", lastName: "", email: "", userType: ""},
    user: {},
  });
};
exports.postSignup = [
  check("firstName")
  .notEmpty().withMessage("First name is required")
  .trim().isLength({ min: 2 }).withMessage("First name must be at least 2 characters long")
  .matches(/^[A-Za-z\s]+$/).withMessage("First name must contain only letters"),

  check("lastName")
  .matches(/^[A-Za-z\s]*$/).withMessage("Last name must contain only letters"),

  check("email")
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
  .matches(/[0-9]/).withMessage("Password must contain at least one number")
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character")
  .trim(),

  check("confirmPassword")
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
  .notEmpty().withMessage("User type is required")
  .isIn(["guest", "host"]).withMessage("Invalid user type"),

  check("terms")
  .notEmpty().withMessage("You must accept the terms and conditions")
  .custom((value, {req}) => {
    if (value !== "on") {
      throw new Error("You must accept the terms and conditions");
    }
    return true;
  }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { firstName, lastName, email, password, userType },
        user: {}
      });
    }
    bcrypt.hash(password, 12).then(hashedPassword => {
      const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
      return user.save();
    }).then(() => {
      res.redirect("/login");
    }).catch(err => {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: [err.message],
        oldInput: { firstName, lastName, email, password, userType },
        user: {}
      });
    });
}];

exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {email},
      user: {}
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid password"],
      oldInput: {email},
      user: {}
    });
  }
  req.session.isLoggedIn = true;
  req.session.user =  {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType
    };

  req.session.save(err => {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};


