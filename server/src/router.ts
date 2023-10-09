import { Router } from "express";
import { controller } from "./controller";
import multer from "multer";
import path from "path";
import cors from "cors";

const storage = multer.diskStorage({
    destination: './src/img',
    filename: (request, file, cb) => {
        console.log('here')
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


const upload = multer({
    storage: storage,
});

export const router = Router();

router.post('/upload', upload.single('image'), controller.uploadImg.bind(controller));
router.get('/returnImg', controller.returnImg.bind(controller));
router.get('/returnModifiedImg', controller.returnModifiedImg.bind(controller));
router.post('/modify', controller.modifyImg.bind(controller));
// router.get('/img/:name', controller.getImg.bind(controller))