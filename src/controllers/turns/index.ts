import { NextFunction, Request, Response } from "express";
import Turn from "../../models/turns";



export const setTurns = {
  check: async (req: Request, res: Response, next: NextFunction) => {},
  do: async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const { role, uid } = req;
    const { startDate, endDate, type, barber, price, name } = req.body;

    console.log("req body", req.body)

    try {
      
      const turn = new Turn({
        name,
        price,
        startDate,
        endDate,
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
      console.log("error", error)
      res.status(400).json({
        ok: false,
        error:"El turno no se guardo",
      });
    }
  },
};
