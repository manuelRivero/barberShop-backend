import { NextFunction, Request, Response } from "express";
import Turn from "../../models/turns";
import mongoose from "mongoose";
import moment from "moment";

export const setTurns = {
  check: async (req: Request, res: Response, next: NextFunction) => {},
  do: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { role, uid } = req;
    const { startDate, endDate, type, barber, price, name } = req.body;
    try {
      const turn = new Turn({
        name,
        price,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        user: role === "user" ? uid : null,
        barber,
      });
      await turn.save();
      res.json({
        ok: true,
        turn,
      });
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        ok: false,
        error: "El turno no se guardo",
      });
    }
  },
};

export const getTurns = {
  check: async (req: Request, res: Response, next: NextFunction) => {},
  do: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    console.log("dates", new Date(moment().utc().utcOffset(3, true).startOf("day").toISOString()), new Date(moment().utc().utcOffset(3, true).endOf("day").toISOString()))
    try {
      const turns = await Turn.aggregate([
        {
          $match: {
            barber: new mongoose.Types.ObjectId(id),
            startDate: { $gte: new Date(moment().utc().utcOffset(3, true).startOf("day").toISOString()), $lt: new Date(moment().utc().utcOffset(3, true).endOf("day").toISOString())},
          },
        },
      ]);
      console.log("turns", turns)
      res.status(200).json({
        ok: true,
        turns,
      });
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        ok: false,
        error: "El turno no se guardo",
      });
    }
  },
};

export const getTurnDetail = {
  do: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const {id} = req.params;

    try {
      const turn = await Turn.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {$lookup: {
          from: 'users',
          localField: 'barber',
          foreignField: '_id',
          as: 'barberData',
        },}
      ]);

      console.log("turn detail", turn)

      res.status(200).json({
        ok: true,
        turn,
      });
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        ok: false,
        error: "El turno no se guardo",
      });
    }
  }
}
