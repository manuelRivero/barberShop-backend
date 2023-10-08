import { Schema, model } from "mongoose";

const Service = new Schema(
  {
    barber:{ type: Schema.Types.ObjectId, ref: "User" },
    name:{
        type:String
    },
    duration:{
        type:Number
    },
    description:{
        type:String
    },
    price:{
        type:String
    },
    image:{
        type:String
    },
    imageName:{
      type:String
    }
  },
  {
    collection: "services",
    timestamps: true,
  }
);

export default model("Service", Service);
