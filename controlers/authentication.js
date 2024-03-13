const { validationResult } = require("express-validator");
const HttpError = require("../models/httpError");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json(users.map((user) => user.toObject({ getters: true })));
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, role, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const createdUser = new User({
    name,
    email,
    file: req.file.filename,
    role,
    password,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json(createdUser);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  req.session.user = existingUser;
  res.json({ isLoggedIn: true, user: req.session.user });
};

const logout = (req, res, next) => {
  if (req.session.user) {
    req.session.user = null;
    req.session.destroy((err) => {
      if (err) {
        const error = new HttpError(
          "Logout failed, please try again later.",
          500
        );
        return next(error);
      }
      res.json({ isLoggedIn: false, user: null });
    });
  } else {
    const error = new HttpError("No user is stored in the session", 500);
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const { id } = req.params;

  let userInfo;

  try {
    userInfo = await User.findById(id);
  } catch (err) {
    const error = new HttpError("Failed to update profile", 500);
    return next(error);
  }

  userInfo.name = name;
  userInfo.email = email;
  userInfo.password = password;

  try {
    await userInfo.save();
  } catch (err) {
    const error = new HttpError("Failed to update profile", 500);
    return next(error);
  }

  res.json(userInfo);
};

exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.getUsers = getUsers;
exports.updateUser = updateUser;
