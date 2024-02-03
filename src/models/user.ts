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
    image: {
      type: String,
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
    }
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export default model("User", User);
