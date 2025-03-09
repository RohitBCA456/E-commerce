import { User } from "../model/user.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;
    if (
      [name, email, phoneNumber, password].some(
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
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      address: address,
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

export { registerUser, loginUser, logoutUser };
