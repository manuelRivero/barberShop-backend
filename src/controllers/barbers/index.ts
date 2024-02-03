import { NextFunction, Request, Response } from "express";
import user from "../../models/user";
import mongoose from "mongoose";
import schedule from "node-schedule"
import moment from "moment";

export const getBarbers = {
    do: async (req: Request, res: Response) => {
        const { uid } = req
        const barbers = await user.aggregate([{
            $match: {
                $or: [{ role: "barber" }, { role: "admin-barber" }],
                _id: { $ne: new mongoose.Types.ObjectId(uid) }
            }
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

export const disableBarber = async (req: Request, res: Response) => {
    const { barber, from, to } = req.body;
    const targetBarber = await user.findById(new mongoose.Types.ObjectId(barber));

    console.log("moment date", moment(to, "DD/MM/yyyy - hh-mm").tz('America/Argentina/Buenos_Aires', true).toDate())

    if (!targetBarber) {
        return res.status(400).json({ ok: false, message: "Barbero no encontrado" })
    } else {
        targetBarber.isActive = false
        await targetBarber.save()
        const job = schedule.scheduleJob(moment(to, "DD/mm/yyyy - hh-mm").tz('America/Argentina/Buenos_Aires').toDate(), async function () {
            console.log("schedule execution")
            targetBarber.isActive = true
            await targetBarber.save()

        });

        return res.status(200).json({ ok: true })

    }

}
