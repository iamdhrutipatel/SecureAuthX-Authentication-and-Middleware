//require express, express router and bcrypt as shown in lecture code
const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const helpers = require("../helpers");

router.route("/").get(async (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/protected");
  } else {
    res.render("userLogin", {
      title: "Login",
    });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session && req.session.user) {
      res.redirect("/protected");
    } else {
      res.render("userRegister", {
        title: "SignUp",
      });
    }
  })
  .post(async (req, res) => {
    try {
      req.body.username = helpers.checkUserName(req.body.username);
      req.body.password = helpers.checkPassWord(req.body.password);
      req.body.password2 = helpers.checkPassWord(req.body.password2);

      if (req.body.password === req.body.password2) {
        const user = await userData.createUser(
          req.body.username,
          req.body.password
        );

        if (!user.insertedUser) throwNewError(500, "Internal Server Error");

        res.redirect("/");
      } else {
        throwNewError(400, "Both Passwords Does Not Match!");
      }
    } catch (error) {
      return res.status(error.code || 400).render("userRegister", {
        title: "SignUp",
        username: req.body.username,
        password1: req.body.password1,
        error: error.message || "Bad Request",
      });
    }
  });

router.route("/login").post(async (req, res) => {
  try {
    req.body.username = helpers.checkUserName(req.body.username);
    req.body.password = helpers.checkPassWord(req.body.password);

    const auth = await userData.checkUser(req.body.username, req.body.password);

    if (!auth.authenticatedUser) {
      throwNewError(400, "Internal Server Error");
    }

    req.session.user = {username: req.body.username};

    res.redirect("/protected");
  } catch (error) {
    return res.status(error.code || 400).render("userLogin", {
      title: "Login",
      username: req.body.username,
      password: req.body.password,
      error: error.message || "Bad Request",
    });
  }
});

router.route("/protected").get(async (req, res) => {
  const currentTimeStamp = new Date().toUTCString();
  res.render("private", {
    title: "Dashboard",
    dateAndTime: currentTimeStamp,
    username: req.session.user.username,
  });
});

router.route("/logout").get(async (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy();
    res.render("logout", {
      title: "Logout",
    });
  } else {
    res.redirect("/");
  }
});

router
  .route("/forgot")
  .get(async (req, res) => {
    res.render("userForget", {
      title: "Forget Password",
    });
  })
  .post(async (req, res) => {
    try {
      req.body.username = helpers.checkUserName(req.body.username);
      req.body.password = helpers.checkPassWord(req.body.password);
      req.body.password2 = helpers.checkPassWord(req.body.password2);

      if (req.body.password === req.body.password2) {
        const user = await userData.forgetUser(
          req.body.username,
          req.body.password
        );

        if (!user.updatedUser) throwNewError(500, "Internal Server Error");

        res.redirect("/");
      } else {
        throwNewError(400, "Both Passwords Does Not Match!");
      }
    } catch (error) {
      return res.status(error.code || 400).render("userForget", {
        title: "Forget Password",
        username: req.body.username,
        password1: req.body.password1,
        error: error.message || "Bad Request",
      });
    }
  });

const throwNewError = (code = 400, message = "Not found") => {
  throw {code, message};
};

module.exports = router;
