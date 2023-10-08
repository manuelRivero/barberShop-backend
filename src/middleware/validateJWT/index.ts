import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export const validateJWT = (req:Request, res:Response, next:NextFunction) => {
  const bearerToken = req.headers.authorization;

  if (bearerToken) {
    const token = bearerToken.split(" ")[1];

    try {
      const { uid, role } = jwt.verify(token, `${process.env.SECRETORPRIVATEKEY}`) as {
        uid: string;
        role: string
    };
      req.uid = uid;
      req.role = role;
      next();
    } catch (error) {
      console.log("error", error);
      return res.status(401).json({
        ok: false,
        message: "Token no válido",
      });
    }
  } else {
    return res.status(401).json({
      ok: false,
      message: "No hay token en la petición",
    });
  }
};
