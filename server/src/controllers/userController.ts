import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

/**
 * POST - /api/users/
 * Registers a new user
 */
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);

    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);

    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    password: hashedPassword,
    role: "USER",
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);

    throw new Error("Invalid user data");
  }
});

/**
 * POST - /api/users/login
 * Authenticate a user logging in
 */
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check for username
  const user = await User.findOne({ username });

  if (user && (await bcryptjs.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);

    throw new Error("Invalid credentials");
  }
});

/**
 * GET - /api/users/me
 * Retrieves the currently logged in user's data
 */
const getLoggedInUser = asyncHandler(async (req: any, res: Response) => {
  const { _id, username, role } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    username,
    role,
  });
});

const generateToken = (id: String) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser, getLoggedInUser };
