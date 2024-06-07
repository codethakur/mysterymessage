import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
sendVerificationEmail;

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const exitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (exitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already taken ",
        },
        {
          status: 400,
        }
      );
    }
    const exitingUserByEmail = await UserModel.findOne({ email });
    const veryfyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (exitingUserByEmail) {
      if (exitingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exit with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        exitingUserByEmail.password = hasedPassword;
        exitingUserByEmail.veryfyCode = veryfyCode;
        exitingUserByEmail.verfyCodeExpiry = new Date(Date.now() + 36000000);
        await exitingUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        veryfyCode: veryfyCode,
        verfyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    //send veryfication Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      veryfyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully please verify your email!",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user!",
      },
      {
        status: 500,
      }
    );
  }
}
