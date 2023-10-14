const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
  session({
    name: "AuthCookie",
    secret: "thisisasecretkeythingforauthentication",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(async (req, res, next) => {
  const currentTimeStamp = new Date().toUTCString();

  let userAuth = "";

  if (req.session.user) {
    userAuth = "Authenticated User";
  } else {
    userAuth = "Non-Authenticated User";
  }

  console.log(
    `[${currentTimeStamp}]: ${req.method} ${req.originalUrl} (${userAuth})`
  );

  next();
});

app.use("/protected", async (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.status(403).render("forbiddenAccess", {
      title: "Forbidden Access",
    });
  } else {
    next();
  }
});

app.engine("handlebars", exphbs.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("The server is ready!");
  console.log("Your routes will be running on http://localhost:3000");
});
