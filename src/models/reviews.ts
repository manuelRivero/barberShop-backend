import { Schema, model } from "mongoose";

const Review= new Schema(
  {
    barber:{ type: Schema.Types.ObjectId, ref: "User" },
    user:{ type: Schema.Types.ObjectId, ref: "User" },
    score:{
        type:Number
    },
    comment:{
        type:String
    }
},
    
  {
    collection: "reviews",
    timestamps: true,
  }
);

export default model("Review", Review);
