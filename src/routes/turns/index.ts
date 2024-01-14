import { Router } from "express";
import { getActiveTurn, getTurnDetail, getTurns, setTurns } from "../../controllers/turns/index";
import { validateJWT } from "../../middleware/validateJWT/index";


const router = Router();


// router.post('/register', register.check, register.do)
router.post('/set', validateJWT, setTurns.do)
router.get('/get/:id', validateJWT, getTurns.do)
router.get('/detail/:id', validateJWT, getTurnDetail.do)
router.get('/get-active/:id', validateJWT, getActiveTurn.do)

// router.get('/me',validateJWT, me.do)

export default router