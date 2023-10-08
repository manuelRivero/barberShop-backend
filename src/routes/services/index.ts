import { Router } from "express";
import { createService, getServices } from "../../controllers/services/index";
import { validateJWT } from "../../middleware/validateJWT/index";

const router = Router();

// router.post('/register', register.check, register.do)
router.get("/", validateJWT, getServices.do);
router.post("/add", validateJWT, createService.do);
// router.get('/me',validateJWT, me.do)

export default router;
