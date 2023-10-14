function checkUserName(value) {
  if (!value || typeof value !== "string" || value.trim().length == 0)
    throwNewError(400, "Username is required!");

  value = value.trim();

  const regex = /^[a-zA-Z0-9]+$/;

  if (!regex.test(value)) {
    throwNewError(400, "Username should be only alphanumeric!");
  }

  if (value.length < 4) {
    throw2Error(400, "Username should be atleast 4 characters long!");
  }

  return value.toLowerCase();
}

function checkPassWord(value) {
  if (!value || typeof value !== "string" || value.trim().length == 0)
    throwNewError(400, "Invalid Password!");

  value = value.trim();

  if (value.length < 6) {
    throwNewError(
      400,
      "Invalid Password, should be atleast 6 characters long!"
    );
  }

  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  if (!regex.test(value)) {
    throwNewError(
      400,
      "Invalid Password, should have atleast 1 UpperCase, 1 Digit & 1 Speacial Character!"
    );
  }

  return value;
}

const throwNewError = (code, message) => {
  throw {code, message};
};

const throw2Error = (error) => {
  if (error.code && error.message) {
    throwNewError(error.code, error.message);
  }

  throwNewError(500, "Internal Server Error");
};

module.exports = {
  checkUserName,
  checkPassWord,
  throwNewError,
  throw2Error,
};
