import { User } from "../models/usersmodel.js";
import { APIresponse } from "../utils/api-response.js"
import { apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js"
const generateAccessandRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    if (!user) {
      throw new apierror(404, "User not found while generating tokens")
    }
   
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generaterefreshtoken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new apierror(500, "Something went wrong while generating access token")
  }
}
const registeruser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

  const existeduser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existeduser) {
    throw new apierror(409, "User with given email or username already exists");
  }

  const createdUser = await User.create({
    email,
    password,
    username,
    isEmailVerified: false
  })

  if (!createdUser) {
    throw new apierror(500, "Something went wrong while registering a user");
  }


  const { unhashedtoken, hashedtoken, tokenexpiry } = createdUser.generatetemporarytoken()

  createdUser.emailVerificationToken = hashedtoken
  createdUser.emailVerificationExpiry = tokenexpiry

  await createdUser.save({ validateBeforeSave: false })
  const user = await User.findById(createdUser._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  )

  return res.status(201).json(
    new APIresponse(
      201,
      { user: user },
      "User registered successfully and verification email has been sent to your email"
    )
  )
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new apierror(400, "Email is required")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new apierror(400, "User does not exist")
  }
  const ispasswordvalid = await user.isPasswordCorrect(password)
  if (!ispasswordvalid) {
    throw new apierror(400, "Invalid credentials")
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);

  const loggedinuser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new APIresponse(200, { user: loggedinuser, refreshToken, accessToken }, "User logged in successfully")
    )
})
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new apierror(401, "Unauthorised access")
  }
  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new apierror(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new apierror(401, "Refresh token is expired")
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    };

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessandRefreshTokens(user._id)

    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(new APIresponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"))
  } catch (error) {
    throw new apierror(401, "Invalid refresh token")
  }
})

export {
  registeruser,
  login,refreshAccessToken}