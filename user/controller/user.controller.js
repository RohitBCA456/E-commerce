import { User } from "../model/user.model.js";
import { publishToQueue } from "../service/RabbitMQ.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    if (
      [username, email, password].some(
        (fields) => fields.trim() === ""  
      )
    ) {
      return res.status(404).json({ messge: "Missing credentials" });
    }
    if (!email.includes("@")) {
      return res.status(404).json({ message: "Email is invalid" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(404)
        .json({ message: "user already exists with this email" });
    }
    const user_data = new User({
      username: username,
      email: email,
      password: password,
    });
    await user_data.save();
    return res.status(200).json({ message: "user registered successfully." });
  } catch (error) {
    console.log("Error occured while registering user.", error);
    return res.status(500).json({ message: "user registration failed." });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((field) => field.trim() === "")) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No email founded" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = await user.generateToken(user._id);
    user.token = token;
    user.save({ validateBeforeSave: false });
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "user logged in successfully." });
  } catch (error) {
    console.log("Error occured while logging in the user.");
    res.status(500).json({ message: "error while logging in the user", error });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { token: "" } },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ message: "No user found." });
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("token", options)
    .json({ message: "user logged out successfully." });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if ([oldPassword, newPassword].some((field) => field.trim() === "")) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ message: "Password changed successfully." });
});

const addToCart = asyncHandler(async (req, res) => {
  const cartData = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }

  const message = {
    userId,
    cartData,
  };

  publishToQueue("addToCart", JSON.stringify(message));
  return res.status(200).json({ message: "Added to cart successfully." });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  addToCart,
  changePassword,
};
