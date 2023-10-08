import {Router} from "express";
import { login, me } from "../../controllers/auth/index";
import { validateJWT } from "../../middleware/validateJWT/index";


const router = Router();


// router.post('/register', register.check, register.do)
router.post('/login', login.check, login.do)
router.get('/me',validateJWT, me.do)

export default router