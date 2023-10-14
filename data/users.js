const mongoCollections = require("../config/mongoCollections");
const user = mongoCollections.userCollection;
const helpers = require("../helpers");
const bcryptjs = require("bcryptjs");

const createUser = async (username, password) => {
  try {
    let usernm = helpers.checkUserName(username);
    let pwd = helpers.checkPassWord(password);

    const userCollection = await user();

    let findUserName = await userCollection.findOne({username: usernm});

    if (findUserName) {
      throwNewError(400, "User already exists!");
    }

    const saltRounds = 15;

    const hash = await bcryptjs.hash(pwd, saltRounds);

    let newUser = {
      username: usernm,
      password: hash,
    };

    const insertedInfo = await userCollection.insertOne(newUser);

    if (!insertedInfo.insertedId) throwNewError(500, "Could not add the user!");

    return {insertedUser: true};
  } catch (error) {
    throw2Error(error);
  }
};

const checkUser = async (username, password) => {
  try {
    let usernm = helpers.checkUserName(username);
    let pwd = helpers.checkPassWord(password);

    const userCollection = await user();

    let findUserName = await userCollection.findOne({username: usernm});

    if (!findUserName)
      throwNewError(400, "The username or password is invalid!");

    let passwordMatch = await bcryptjs.compare(pwd, findUserName.password);

    if (passwordMatch) {
      return {authenticatedUser: true};
    } else {
      throwNewError(400, "The username or password is invalid!");
    }
  } catch (error) {
    throw2Error(error);
  }
};

const throwNewError = (code = 404, message = "Not found") => {
  throw {code, message};
};

const throw2Error = (error) => {
  if (error.code && error.message) {
    throwNewError(error.code, error.message);
  }
  throwNewError(500, "Internal Server Error");
};

module.exports = {
  createUser,
  checkUser,
  throwNewError,
  throw2Error,
};
