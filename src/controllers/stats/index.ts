import { NextFunction, Request, Response } from "express";
import Turn from "../../models/turns";
import moment from "moment";
import mongoose from "mongoose";
export const getThisWeekStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const firstDayOfWeek = req.body.from
  const lastDayOfWeek = req.body.to
  const { id } = req.query
  const { uid } = req

  try {
    const data = await Turn.aggregate([
      {
        $match: {
          startDate: {
            $gte: new Date(firstDayOfWeek),
            $lte: new Date(lastDayOfWeek),
          },
          barber: new mongoose.Types.ObjectId(id ? String(id) : uid)
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "type",
          foreignField: "_id",
          as: "seviceData",
        },
      },
      {
        $addFields: {
          day: { $dayOfMonth: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$day",
          dayTotalServices: { $sum: 1 },
          dayTotalAmount: { $sum: "$price" },
        },
      },
    ]);
    res.json({ data: data });
  } catch (error) {
    res.json({ error: "No se pudo cargar la infomación solicitada" });
  }
};
