import { NextFunction, Request, Response } from "express";
import Turn from "../../models/turns";
import mongoose from "mongoose";
import moment from 'moment-timezone';
import User from "../../models/user";

export const setTurns = {
  check: async (req: Request, res: Response, next: NextFunction) => { },
  do: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { role, uid } = req;
    const { startDate, endDate, type, barber, price, name } = req.body;
    // check barber availability
    const targetBarber = await User.findById(barber)

    if (!targetBarber){
      res.status(404).json({ok:false, error: "Barbero no encontrado"})
    }
    if(targetBarber && !targetBarber.isActive){
      res.status(404).json({ok:false, error: "Barbero no disponible"})

    }
      // check turn availability
      console.log("dates set turn");
    const targetTurn = await Turn.aggregate([
      {
        $match: {
          $or: [
            {
              startDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
            },
            { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
          ],
        },
      },
    ]);
    console.log("set turn, target turn", targetTurn);
    if (targetTurn.length > 0) {
      res.status(400).json({
        ok: false,
        error: "Hora del turno ya agendada",
      });
      return;
    }
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

export const completeTurn = {
  check: async (req: Request, res: Response, next: NextFunction) => { },
  do: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.body;

    const targetTurn = await Turn.findById(id)

    if (!targetTurn) {
      res.json({ ok: false, error: "Turno no encontrado" })
    } else {
      targetTurn.status = "COMPLETE"
      await targetTurn?.save()
      res.json({ ok: true })
    }

  }
}

export const cancelTurn = {
  check: async (req: Request, res: Response, next: NextFunction) => { },
  do: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.body;

    const targetTurn = await Turn.findById(id)

    if (!targetTurn) {
      res.json({ ok: false, error: "Turno no encontrado" })
    } else {
      targetTurn.status = "CANCELED"
      await targetTurn?.save()
      res.json({ ok: true })
    }

  }
}
// set $lte params to bussinessHourEnd 
export const getTurns = {
  check: async (req: Request, res: Response, next: NextFunction) => { },
  do: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const {date} = req.query
    const day = date ? moment(date).get("date") : moment.tz('America/Argentina/Buenos_Aires').get("date");
    console.log("day", day)
    try {
      const turns = await Turn.aggregate([
        {
          $match: {
            barber: new mongoose.Types.ObjectId(id),
            startDate: {
              $gte: moment()
                .set({ dates: day, hour: 0, minutes: 0 })
                .toDate(),
              $lte: moment()
                .set({ dates: day, hour: 23, minutes: 0 })
                .toDate(),
            },
          },

        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        }
      ]);
      console.log("turns", turns);
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
  do: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const turn = await Turn.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
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
        {
          $lookup: {
            from: "services",
            localField: "type",
            foreignField: "_id",
            as: "serviceData"
          }
        }
      ]);

      console.log("turn detail", turn);

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
  },
};

// agregar hora de cierre del local
export const getActiveTurn = {
  do: async (req: Request, res: Response): Promise<void> => {
    const { uid } = req
    
    const turn = await Turn.aggregate([
      {
        $match: {
          status:{$ne: "CANCELED"},
          user: new mongoose.Types.ObjectId(uid),
          endDate: {
            $gte: moment.tz('America/Argentina/Buenos_Aires')
              .set({ hour: 0, minutes: 0 })
              .toDate(),
            $lt: moment.tz('America/Argentina/Buenos_Aires')
              .set({ hour: 23, minutes: 59 })
              .toDate(),
          }

        }
      },
      {
        $lookup: {
          from: "services",
          localField: "type",
          foreignField: "_id",
          as: "serviceData"
        }
      }
    ])
    res.json(turn)
  }
}
