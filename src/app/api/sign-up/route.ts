import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUserName = await UserModel.findOne({
        username,
        isVerified: true
    })
    if(existingUserVerifiedByUserName){
        return Response.json({
            success:false,
            message:"Username is already taken"
        },{status:400})
    }

   const existingUserByEmail =  await UserModel.findOne({email})
   const  veryfyCode = Math.floor(10000+Math.random()*900000).toString() 
   if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json({
                success:false,
                message:"user already exit with this email"
            },{status:400})   
        }else{
            const hasedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password=hasedPassword;
            existingUserByEmail.veryfyCode = veryfyCode;
            existingUserByEmail.verfyCodeExpiry = new Date(Date.now()+3600000)
            await existingUserByEmail.save()
        }
   }else{
        const hasedPassword = await bcrypt.hash(password,10)
        const expriyDate = new Date()
        expriyDate.setHours(expriyDate.getHours()+1)
        const newUser = new UserModel({
            username,
            email,
            password: hasedPassword,
            veryfyCode,
            verfyCodeExpiry: expriyDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages:[]
        })
        await newUser.save()
   }
   //Send  Verification Email
   const emailResponse =await sendVerificationEmail(
            email,
            username,
            veryfyCode
   )
   if(emailResponse.success){
    return Response.json({
        success:false,
        message:"User register successfully, Please verify your email"
    },{status:201})
   }

   return Response.json({
    success:true,
    message:emailResponse.message
},{status:500})

  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user ",
      },
      {
        status: 500,
      }
    );
  }
}