const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signUp = async (req, res) => {
  const userInputPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(userInputPassword, 12);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  await newUser.save();
  res.redirect("/login");
};

exports.logIn = async (req, res) => {
  const userInputEmail = req.body.email;
  const userInputPassword = req.body.password;
  const user = await User.findOne({ email: userInputEmail });
  if (!user) {
    return res.status(400).send("Incorrect email address!");
  }
  const passwordIsCorrect = await bcrypt.compare(
    userInputPassword,
    user.password
  );

  if (!passwordIsCorrect) {
    return res.status(400).send("Incorrect Password!");
  }
  req.session.user = {
    id: user._id.toString(),
    email: user.email,
  };

  res.redirect("/feed");
};
