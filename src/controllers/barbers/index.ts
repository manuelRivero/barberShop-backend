import { NextFunction, Request, Response } from "express";
import user from "../../models/user";
import mongoose from "mongoose";

export const getBarbers = {
    do: async (req: Request, res: Response) => {
        const barbers = await user.aggregate([{
          $match:{role: "barber"}
        }]);
        console.log("barbers", barbers);
        res.json({
            ok: true,
            barbers,
        });
    },
};
