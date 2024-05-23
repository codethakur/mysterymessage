import { User } from 'next-auth';
import { UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(reqeust:Request) {
    await dbConnect
    const {username, content} = await reqeust.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"user not found"
                },{
                    status:404
                }
            )
        }
        //is User acceptionfg the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success:false,
                    message:"user not acceptionfg the messages"
                },{
                    status:403
                }
            )
        }
        const newMessage = {content, createdAt:new Date()}
        user.messages.push(newMessage as Message)

        await user.save()
        return Response.json(
            {
                success:true,
                message:"message sent successfully"
            },{
                status:401
            }
        )
    } catch (error) {
        console.log("Error adding  message: ", error)
        return Response.json(
            {
                success:false,
                message:"Internel server error"
            },{
                status:500
            }
        )
    }
}