import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodeUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodeUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 409 }
      );
    }
    const isCodeValid = user.verfyCodeExpiry == code;
    const isCodeNotExpired = new Date(user.verfyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified succfully ",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please signup again to get new code ",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code ",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error(" Error Verifing user", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifing user",
      },
      {
        status: 500,
      }
    );
  }
}
