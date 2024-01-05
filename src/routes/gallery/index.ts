import {Router} from "express";
import { validateJWT } from "../../middleware/validateJWT/index";
import { deleteImage, getImages, uploadImage } from "../../controllers/gallery";

const router = Router();

router.get('/', validateJWT, getImages)

router.delete('/delete/:id', validateJWT, deleteImage)

router.post('/create', validateJWT, uploadImage)

export default router