import User from "../models/user.model";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const resolversUser = {
  Query: {
    getUser: async (_: any, args: any, context: any) => {
      // Kiểm tra xác thực cho truy vấn này
      console.log(context.user);

      if (!context.user) {
        throw new Error("Unauthorized - Token required");
      }

      

      const infoUser = await User.findOne({ 
        _id: context.user.id,
        deleted: false
      }).select('-password');

      if(infoUser) {
        return {
          code: 200,
          id: infoUser.id,
          fullName: infoUser.fullName,
          email: infoUser.email,
          message: "User found"
        }
      } else {
        return {
          code: 400,
          message: "User not found"
        }
      }
    }
  },
  Mutation: {
    registerUser: async (_: any, args: any) => {
      const { user } = args;
      
      const emailExist = await User.findOne({ 
        email: user.email 
      });

      if (emailExist) {
        return {
          code: 400,
          message: "Email already exists"
        }
      } else {
        user.password = md5(user.password);

        const newUser = new User(user);
        const data = await newUser.save();

        return {
          code: 200,
          id: data.id,
          fullName: data.fullName,
          email: data.email
        };
      }
    },
    loginUser: async (_: any, args: any) => {
      const { email, password } = args.user;

      const infoUser = await User.findOne({
        email: email,
        deleted: false
      });

      if (!infoUser) {
        return {
          code: 400,
          message: "Email does not exist"
        }
      }

      if (infoUser.password !== md5(password)) {
        return {
          code: 400,
          message: "Password is incorrect"
        }
      }
      
      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        throw new Error("JWT_SECRET_KEY is not defined in environment variables");
      }

      const jti = uuidv4();
      const token = jwt.sign(
        { id: infoUser.id, jti },
        secretKey,
        { expiresIn: '7d' }
      );

      return {
        code: 200,
        id: infoUser.id,
        fullName: infoUser.fullName,
        email: infoUser.email,
        token: token,
        message: "Login successfully!"
      }
    }
  }
}