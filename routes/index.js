//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.
const routesAPI = require("./routesAPI");

const constructorMethod = (app) => {
  app.use("/", routesAPI);

  app.use("*", (req, res) => {
    res.status(404).send("404 Page Not Found!");
  });
};

module.exports = constructorMethod;
