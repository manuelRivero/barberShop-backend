import {Router} from "express";
import { validateJWT } from "../../middleware/validateJWT/index";
import { deleteImage, getImages, getImagesFromBarber, uploadImage } from "../../controllers/gallery";

const router = Router();

router.get('/', validateJWT, getImages)
router.get('/images-from-barber/:id', validateJWT, getImagesFromBarber)

router.delete('/delete/:id', validateJWT, deleteImage)

router.post('/create', validateJWT, uploadImage)

export default router