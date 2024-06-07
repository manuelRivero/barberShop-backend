import { Router } from "express";
import { createBarber, disableBarber, editBarber, getBarberDetail, getBarbers } from "../../controllers/barbers/index";
import { validateJWT } from "../../middleware/validateJWT/index";

const router = Router();

// router.post('/register', register.check, register.do)
router.get("/", validateJWT, getBarbers.do);

router.get("/:id", validateJWT, getBarberDetail)

router.post("/disable", validateJWT, disableBarber)

router.post("/create", validateJWT, createBarber)

router.post("/edit", validateJWT, editBarber)

export default router;
