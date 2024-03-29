import mongoose, { Schema, model } from "mongoose";

const User = new Schema(
  {
    name: {
      type: String,
    },
    lastname: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "user",
    },  
    bio:{
      type:String,
      defaul: null
    },
    commission:{
      type:Number,
      default: null
    },
    score:{
      type:Number,
      default: 5,
    },
    isActive:{
      type:Boolean
    },
    phone:{
      type: String,
      default: null,
    }
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export default model("User", User);
