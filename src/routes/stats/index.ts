import {Router} from "express";
import { validateJWT } from "../../middleware/validateJWT/index";
import { getThisWeekStats } from "../../controllers/stats";


const router = Router();


router.get('/get-week-stats', validateJWT, getThisWeekStats)

export default router