import { Router } from "express";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.post('/upload',upload.fields([{name:"content",maxCount:5}]),)

export default router;