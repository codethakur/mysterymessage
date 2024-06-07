import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/User";

export async function DELETE(
  reruest: Request,
  { params }: { params: { messagesid: string } }
) {
  const messagesId = params.messagesid;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        session: false,
        message: "Not Authenticated",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messagesId } } }
    );
    if (updateResult.modifiedCount == 0) {
      return Response.json(
        {
          session: false,
          message: "Message not found or already delete",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        session: true,
        message: "Message Deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in delete message route", error);
    return Response.json(
      {
        session: false,
        message: "Error Deleting  message",
      },
      {
        status: 500,
      }
    );
  }
}
