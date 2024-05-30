import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { z } from "zod";
import { usenameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usenameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // Validation with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message: usernameError.length > 0 ? usernameError.join(", ") : "Invalid query params",
        }),
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

    if (existingVerifiedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username already taken",
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is unique",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      { status: 500 }
    );
  }
}
