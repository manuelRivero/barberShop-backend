import {Router} from "express";
import { validateJWT } from "../../middleware/validateJWT/index";
import { setBusinessSchedule } from "../../controllers/settings";

const router = Router();

router.get('/business-schedule', validateJWT, setBusinessSchedule.do)

export default router