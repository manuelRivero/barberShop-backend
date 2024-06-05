import { NextFunction, Request, Response } from "express";
import Settings from "../../models/settings";

export const setBusinessSchedule = {
  do: async (req: Request, res: Response) => {
    const { hourEnd, hourStart, offset, phone, code, country } = req.body;

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
            businessOffset: offset,
            businessPhone: phone,
            countryCode:code,
            businessCountry: country,
          });
          await settings.save();
          res.json({ ok: true, settings });
        } catch (error) {
          res
            .status(400)
            .json({ ok: false, error: "No se pudo crear la colección" });
        }
      }
      if (count === 1) {
        try {
          const [settings] = await Settings.find();
          settings.businessHourStart = hourStart;
          settings.businessHourEnd = hourEnd;
          settings.businessOffset = offset;
          settings.businessPhone = phone;
          settings.countryCode = code;
          settings.businessCountry = country;
            await settings.save();
            res.json({ ok: true, settings });
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

export const getBusinessSchedule = {
  do: async (req: Request, res: Response) => {
    console.log("getBusinessSchedule controller");

    const [settings] = await Settings.find()
    res.json({
      ok: true,
      settings,
    });
  },
};


