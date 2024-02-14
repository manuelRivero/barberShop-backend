import {Router} from "express";
import { editProfile, facebookLogin, login, me, refreshTokenFunc } from "../../controllers/auth/index";
import { validateJWT } from "../../middleware/validateJWT/index";


const router = Router();


// router.post('/register', register.check, register.do)
router.post('/login', login.check, login.do)
router.put('/edit-profile', editProfile.do)
router.post('/token', refreshTokenFunc.do)
router.get('/me',validateJWT, me.do)
router.post('/facebook-login', facebookLogin.do)

export default router