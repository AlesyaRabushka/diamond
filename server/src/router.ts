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


const uploadWithoutStorage = multer();


export const router = Router();

router.post('/upload', upload.single('image'), controller.uploadImg.bind(controller));
// router.get('/returnImg', controller.returnImg.bind(controller));
// router.post('/returnModifiedImg', controller.returnModifiedImg.bind(controller));
router.post('/modify', controller.modifyImg.bind(controller));
router.post('/modify-v2', uploadWithoutStorage.single('image'), controller.modifyImgV2.bind(controller));
router.post('/verifyColors', controller.verifyColors.bind(controller));
router.post('/verifyColors-v2', uploadWithoutStorage.single('image'), controller.verifyColorsV2.bind(controller));
// router.post('/change-color', controller.changeColor.bind(controller));
router.post('/change-color-v2', uploadWithoutStorage.single('image'), controller.changeColorV2.bind(controller));
router.post('/change-color-v3', uploadWithoutStorage.single('image'), controller.changeColorV3.bind(controller));

router.post('/get-new-color-pallete', controller.getNewColorPallete.bind(controller))