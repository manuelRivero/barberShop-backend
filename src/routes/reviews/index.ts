import {Router} from "express";
import { validateJWT } from "../../middleware/validateJWT/index";
import { createReview, getReviews } from "../../controllers/reviews";

const router = Router();

router.get('/', validateJWT, getReviews)

router.post('/create', validateJWT, createReview)

export default router