import { NextFunction, Request, Response } from "express";
import Settings from "../../models/settings";

export const setBusinessSchedule = {
  do: async (req: Request, res: Response) => {
    const { hourEnd, hourStart } = req.body;

    try {
      const count = await Settings.countDocuments();
      if (count > 1) {
        throw new Error("Settings document already exists.");
      }

      if (count === 0) {
        try {
          const settings = new Settings({
            businessHourStart: hourStart,
            businessHourEnd: hourEnd,
          });
          await settings.save();
          res.json({ ok: true });
        } catch (error) {
          res
            .status(400)
            .json({ ok: false, error: "No se pudo crear la colección" });
        }
      }
      if (count === 1) {
        try {
          const [settings] = await Settings.find();
          (settings.businessHourStart = hourStart),
            (settings.businessHourEnd = hourEnd),
            await settings.save();
        } catch (error) {
          res
            .status(400)
            .json({ ok: false, error: "No se pudo actualizar la colección" });
        }
      }
    } catch (error) {
      res
        .status(400)
        .json({ ok: false, error: "Error al encontrar la colleción" });
    }
  },
};