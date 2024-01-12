import {Router} from "express";
import { validateJWT } from "../../middleware/validateJWT/index";
import { getAllStatsFromDates, getThisWeekStats } from "../../controllers/stats";


const router = Router();


router.get('/get-week-stats', validateJWT, getThisWeekStats)
router.get('/get-all-stats-from-dates', validateJWT, getAllStatsFromDates)

export default router