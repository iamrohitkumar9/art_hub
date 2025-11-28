
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


module.exports = {
  // ---------- REGISTER ----------
  async register(data) {
    const { name, email, password, role } = data;

    // Check if email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });



    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return { token, user };
  },

  // ---------- LOGIN ----------
  async login(data) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return { token, user };
  },
};
