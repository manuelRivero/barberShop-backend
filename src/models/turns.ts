import { Schema, model } from "mongoose";

const Turn = new Schema(
  {
    barber:{ type: Schema.Types.ObjectId, ref: "User" },
    user:{ type: Schema.Types.ObjectId, ref: "User", default:null },
    type:{ type: Schema.Types.ObjectId, ref: "Services"},
    startDate:{
        type: Date  
    },
    endDate:{
        type: Date  
    },
    price:{
      type:Number
    },
    name:{
      type:String
    }
  },
  {
    collection: "turns",
    timestamps: true,
  }
);

export default model("Turn", Turn);
