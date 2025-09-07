import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const extractUserFromToken = async (req: Request) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error("JWT_SECRET_KEY is not defined in environment variables");
      return null;
    }

    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const userId = decoded.id;
    
    const user = await User.findOne({
      _id: userId,
      deleted: false
    }).select('-password');

    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null; 
  }
};