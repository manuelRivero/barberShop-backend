import { Router } from "express";
import { validateJWT } from "../../middleware/validateJWT/index";
import { getBusinessSchedule, setBusinessSchedule } from "../../controllers/settings";

const router = Router();

// router.get('/business-schedule', validateJWT, setBusinessSchedule.do)
router.get("/", validateJWT, getBusinessSchedule.do);
router.post("/business-schedule", validateJWT, setBusinessSchedule.do);

export default router;
