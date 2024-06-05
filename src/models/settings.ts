import { Schema, model } from "mongoose";

const Settings = new Schema(
  {
    businessHourStart: { type: String },
    businessHourEnd: { type: String },
    businessOffset: { type: String },
    businessPhone: { type: String },
    countryCode: { type: String },
    businessCountry: { type: String },
  },

  {
    collection: "settings",
    timestamps: true,
  }
);

export default model("Settings", Settings);
