import { Schema, model } from "mongoose";

const Gallery= new Schema(
  {
    barber:{ type: Schema.Types.ObjectId, ref: "User" },
    url: {type: String},
    assetId:{type:String},
    publicId:{type:String}
},
    
  {
    collection: "gallery",
    timestamps: true,
  }
);

export default model("Gallery", Gallery);