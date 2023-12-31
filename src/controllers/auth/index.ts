import User from "../../models/user";
import { validateBody } from "./../../helpers/validate/index";
import bcript from "bcryptjs";
import joi from "joi";
import { generatejWT } from "../../helpers/auth/auth/index";
import cloudinary from "../../helpers/imageUpload/index";
import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";

// export const register = {
//   check: (req, res, next) => {
//     const schema = joi.object({
//       name: joi.string().required(),
//       email: joi.string().email().required(),
//       lastName: joi.string().required(),
//       password: joi.string().min(8).required(),
//     });
//     validateBody(req, next, schema);
//   },
//   do: async (req, res, next) => {
//     const { files, body } = req;
//     const { name, lastName, password, email } = body;

//     try {
//       const targetUser = await User.find({ email: email });
//       console.log("target user", targetUser);
//       if (targetUser.length > 0) {
//         res.status(400).json({
//           ok: false,
//           error: "Usuario ya registrado",
//           ref: "email",
//         });
//         return;
//       }
//     } catch (error) {
//       res.status(400).json({
//         ok: false,
//         error: "Error al identificar al usuario",
//         ref: "email",
//       });
//     }

//     try {
//       const salt = bcript.genSaltSync();
//       const newUser = new User({
//         name,
//         lastName,
//         email,
//       });

//       newUser.password = bcript.hashSync(password, salt);
//       await newUser.save();
//       res.json({
//         ok: true,
//       });
//     } catch (error) {
//       console.log("error", error);
//       res.status(400).json({
//         ok: false,
//         error: "Error en la creación del usuario",
//         ref: "email",
//       });
//     }
//   },
// };

export const login = {
  check: (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    validateBody(req, next, schema);
  },
  do: async (req: Request, res: Response, next: NextFunction) => {
    console.log("login");
    const { email, password } = req.body;
    console.log("email", email, "password", password)
    const targetUser = await User.findOne({ email });
    console.log("Target user", targetUser)
    if (!targetUser) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }
    if (targetUser.password) {
      if (!bcript.compareSync(password, targetUser.password)) {
        return res.status(404).json({
          ok: false,
          message: "Contraseña incorrecta",
        });
      }
      const token = await generatejWT(targetUser._id.toString(), targetUser.role);
      res.status(200).json({
        ok: true,
        token,
      });
    }
  },
};

export const me = {
  do: async (req: Request, res: Response) => {
    const { uid } = req;
    console.log("uid", uid)
    const targetUser = await User.findById(new mongoose.Types.ObjectId(uid)).select(" -password");
    console.log("target user", targetUser);

    res.json({ data: targetUser });
  },
};

export const facebookLogin = {
  do: async (req: Request, res: Response) => {
    const { access_token } = req.body;
    console.log("access_token", access_token);
    const data = await fetch(
      `https://graph.facebook.com/me?access_token=${req.body.access_token}&fields=email,first_name,last_name`
    );
    const { email, last_name, first_name } = await data.json();

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      // register user
      console.log("register case");

      try {
        const newUser = new User({
          name: first_name,
          lastName: last_name,
          email,
          role:'user'
        });
        await newUser.save();
        const token = await generatejWT(newUser._id.toString());
        res.status(200).json({
          ok: true,
          token,
        });
      } catch (error) {}
      return;
    }
    const token = await generatejWT(targetUser.id);
    res.status(200).json({
      ok: true,
      token,
    });
  },
};
