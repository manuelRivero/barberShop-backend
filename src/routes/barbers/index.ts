import { Router } from "express";
import { getBarbers } from "../../controllers/barbers/index";
import { validateJWT } from "../../middleware/validateJWT/index";

const router = Router();

// router.post('/register', register.check, register.do)
router.get("/", validateJWT, getBarbers.do);

export default router;
