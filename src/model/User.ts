import mongoose, { Schema, Document, Model } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  veryfyCode: string;
  verfyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is requried"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is requried"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is requried"],
  },
  veryfyCode: {
    type: String,
    required: [true, "verify is requried"],
  },
  verfyCodeExpiry: {
    type: Date,
    required: [true, "verify is requried"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
});

export const UserModel: Model<User> =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", UserSchema);
