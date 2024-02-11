import { NextFunction, Request, Response } from "express";
import Turn from "../../models/turns";
import moment from "moment";
import mongoose from "mongoose";

export const getThisWeekStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const firstDayOfWeek = req.query.from;
  const lastDayOfWeek = req.query.to;
  const { id } = req.query;
  const { uid } = req;

  try {
    const data = await Turn.aggregate([
      {
        $match: {
          startDate: {
            $gte: new Date(firstDayOfWeek as string),
            $lte: new Date(lastDayOfWeek as string),
          },
          barber: new mongoose.Types.ObjectId(id ? String(id) : uid),
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
          day: { $dayOfMonth: "$endDate" },
          date: "$endDate",
        },
      },
      {
        $group: {
          _id: "$day",
          date: { $first: "$date" },
          dayTotalServices: { $sum: 1 },
          dayCompleteServices: {
            $sum: {
              $cond: [{ $eq: ['$status', 'COMPLETE'] }, 1, 0]
            }
          },
          dayCanceledServices: { $sum: { $cond: [{ $eq: ['$status', 'CANCELED'] }, 1, 0] } },
          dayTotalAmount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETE'] }, "$price", 0] } },
        },
      },
    ]);
    res.json({ data: data });
  } catch (error) {
    res.json({ error: "No se pudo cargar la infomación solicitada" });
  }
};

export const getAllStatsFromDates = async (req: Request, res: Response) => {
  const from = req.query.from;
  const to = req.query.to;
  try {
    const data = await Turn.aggregate([
      {
        $match: {
          startDate: {
            $gte: new Date(from as string),
            $lte: new Date(to as string),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "barber",
          foreignField: "_id",
          as: "barberData",
        },
      },

      { $unwind: "$barberData" },
      { $addFields: {} },
      {
        $group: {
          _id: "$barberData._id",
          name: { $first: "$barberData.name" },
          lastName: { $first: "$barberData.lastname" },
          commission: { $first: "$barberData.commission" },
          completeTurns: { $sum: {$cond:[{$eq:["$status", "COMPLETE"]}, 1, 0]} },
          canceledTurns: { $sum: {$cond:[{$eq:["$status", "CANCELED"]}, 1, 0]} },
          total: { $sum: {$cond:[{$eq:["$status", "COMPLETE"]}, "$price", 0]} },
        },
      },
      {
        $addFields: {
          totalForBarber: {
            $divide: [{ $multiply: ["$total", "$commission"] }, 100],
          },
        },
      },
    ]);
    res.json({ data: data });
  } catch (error) {
    res.json({ error: "No se pudo cargar la infomación solicitada" });
  }
};
