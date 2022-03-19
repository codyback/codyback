import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  id: String;
}

const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // get user from token - don't return password field
      req.user = await User.findById(id).select("-password");

      next();
    } catch (err: any) {
      console.log(err);

      res.status(401);

      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);

    throw new Error("Not authorized - No token");
  }
});

export { protect };
