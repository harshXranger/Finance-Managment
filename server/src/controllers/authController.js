import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,}$/;

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

const signup = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    if (!gmailRegex.test(email)) {
      res.status(400);
      throw new Error("Only @gmail.com email addresses are allowed");
    }

    if (!strongPasswordRegex.test(password)) {
      res.status(400);
      throw new Error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    if (!gmailRegex.test(email)) {
      res.status(400);
      throw new Error("Login requires a valid @gmail.com email address");
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

export { login, me, signup };
