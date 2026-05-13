import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [gmailRegex, "Email must be a valid @gmail.com address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: (value) => strongPasswordRegex.test(value),
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
