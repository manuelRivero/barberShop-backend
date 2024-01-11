import { NextFunction, Request, Response } from "express";
import user from "../../models/user";
import mongoose from "mongoose";

export const getBarbers = {
    do: async (req: Request, res: Response) => {
        const barbers = await user.aggregate([{
            $match: { role: "barber" }
        }]);
        console.log("barbers", barbers);
        res.json({
            ok: true,
            barbers,
        });
    },
};

export const getBarberDetail = async (req: Request, res: Response) => {
    const { id } = req.params
    const barber = await user.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(id) }
    },
    {
        $project: {
            name: 1,
            lastname: 1,
            email: 1,
            image: 1,
            role: 1,
            bio: 1,
            commission: 1,
        }
    }]);
    console.log("barbers", barber);
    res.json({
        ok: true,
        barber,
    });
}

