import {Router} from "express";
import { setTurns} from "../../controllers/turns/index";
import { validateJWT } from "../../middleware/validateJWT/index";


const router = Router();


// router.post('/register', register.check, register.do)
router.post('/set', validateJWT, setTurns.do)
// router.get('/me',validateJWT, me.do)

export default router