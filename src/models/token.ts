import { Schema, model } from "mongoose";

const Token = new Schema(
    {
        refreshToken: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId
        }
    },
    {
        collection: "tokens",
        timestamps: true,
    }
);

export default model("Token", Token);
