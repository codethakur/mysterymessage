import { getServerSession } from "next-auth";
import  authOptions  from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";
import { UserModel } from "@/model/User";

export async function GET(reruest:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;


    if(!session || !session.user){
        return Response.json(
            {
                session:false,
                message:"Not Authenticated"
            },{
                status:400
            }
        )
    }

    const  userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user =  await UserModel.aggregate([
            {$match: {id:userId}},
            {$unwind: '$message'},
            {$sort:{'message.createdAt':-1}},
            {$group:{_id:'$_id', message:{$push:'$messages'}}}
        ])
        if(!user && user==null){
            return Response.json(
                {
                    session:false,
                    message:"user not found"
                },{
                    status:400
                }
            )
        }
        return Response.json(
            {
                session:true,
                messages:user[0].messages
            },{
                status:200
            }
        )
    } catch (error) {
        console.log("An expected error occured: ", error)
        return Response.json(
            {
                success:false,
                message:"user not found"
            },{
                status:500
            }
        )
    }
}