import { Router } from "express";
import { createService, editService, getBarberServices, getServices } from "../../controllers/services/index";
import { validateJWT } from "../../middleware/validateJWT/index";
import { cancelTurnUser } from "../../controllers/turns";

const router = Router();

// router.post('/register', register.check, register.do)
router.get("/", validateJWT, getServices.do);
router.post("/add", validateJWT, createService.do);
router.patch("/edit", validateJWT, editService.do);
router.get("/:id", validateJWT, getBarberServices.do);
router.delete("/:id", validateJWT, cancelTurnUser.do);

// router.get('/me',validateJWT, me.do)

export default router;
