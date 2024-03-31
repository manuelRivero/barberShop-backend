import { Router } from "express";
import { disableBarber, getBarberDetail, getBarbers } from "../../controllers/barbers/index";
import { validateJWT } from "../../middleware/validateJWT/index";

const router = Router();

// router.post('/register', register.check, register.do)
router.get("/", validateJWT, getBarbers.do);

router.get("/:id", validateJWT, getBarberDetail)

router.post("/disable", validateJWT, disableBarber)

export default router;
