import { Router } from "express";
import { controller } from "./controller";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: './src/img',
    filename: (request, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


const upload = multer({
    storage: storage,
});

export const router = Router();

router.post('/upload', upload.single('img'), controller.uploadImg.bind(controller));
router.post('/convert', controller.convertImg.bind(controller));
// router.get('/img/:name', controller.getImg.bind(controller))