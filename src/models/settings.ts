import { Schema, model } from "mongoose";

const Settings= new Schema(
  {
    businessHourStart: {type: String},
    businessHourEnd:{type:String},
},
    
  {
    collection: "settings",
    timestamps: true,
  }
);

export default model("Settings", Settings);