import { Router } from "express";
import { getBarberDetail, getBarbers } from "../../controllers/barbers/index";
import { validateJWT } from "../../middleware/validateJWT/index";

const router = Router();

// router.post('/register', register.check, register.do)
router.get("/", validateJWT, getBarbers.do);

router.get("/:id", validateJWT, getBarberDetail)

export default router;
