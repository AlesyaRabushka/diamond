import {createCanvas, loadImage, ImageData} from "canvas";
import {writeFileSync, readFileSync, existsSync, unlinkSync} from "fs";

import {read} from "jimp";

export class Service{
    constructor(){};

    async uploadImg(imgName: string){
        try {
            const path = `${process.env.SYSTEM_PATH}/${imgName}`;

            const img = await loadImage(path);
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imgData = canvas.toDataURL();
            console.log(String(process.env.IMG_ORIGINAL_DATA_PATH));
            writeFileSync(String(process.env.IMG_ORIGINAL_DATA_PATH), imgData);

            return imgData;
        } catch (error) {
            console.log('[Service error]: UPLOAD', error);

            throw error;
        }
    }

    async modifyImg(path:string, pixelationFactor:number){
        try {

            const img = read(path);
            const newImgName = `pixelate_${Date.now()}.jpeg`;
            if (pixelationFactor == 0){
                const paths = path.split('/');
                
                return paths.pop();
            }
            (await img).pixelate(pixelationFactor).write(`${process.env.SYSTEM_PATH}/${newImgName}`);
            console.log('NEW NAME', newImgName);

            return newImgName;
            
        } catch (error) {
            console.log('[Service error]: MODIFY', error)

            throw error;
        }
    }
    async returnImg(){
        try {
            let imgData = '';
            if (existsSync(String(process.env.IMG_ORIGINAL_DATA_PATH))){
                console.log('find file!')
                imgData = readFileSync(String(process.env.IMG_ORIGINAL_DATA_PATH), 'utf-8');
            }
            
            return imgData;
        } catch (error) {
            console.log('[Service error]: RETURN IMG', error)

            throw error;
        }
    }

    async returnModifiedImg(imgName:string){
        try {
            console.log('return modified', `${process.env.SYSTEM_PATH}/${imgName}`)
            
            const pixelatedImg = await loadImage(`${process.env.SYSTEM_PATH}/${imgName}`);
            const canvas = createCanvas(pixelatedImg.width, pixelatedImg.height)
            const ctx = canvas.getContext('2d');

            const height = pixelatedImg.height;
            const width = pixelatedImg.width;

            ctx.drawImage(pixelatedImg, 0, 0, width, height);
            const newImgData = canvas.toDataURL('image/jpeg');
            console.log('before write');
            writeFileSync(String(process.env.IMG_MODIFIED_DATA_PATH), newImgData);
            console.log('done')
            
            let imgData = '';
            if (existsSync(String(process.env.IMG_MODIFIED_DATA_PATH))){
                imgData = readFileSync(String(process.env.IMG_MODIFIED_DATA_PATH), 'utf-8');
                console.log(String(process.env.IMG_MODIFIED_DATA_PATH));
                console.log('here in modified!')
            }

            unlinkSync(String(process.env.IMG_MODIFIED_DATA_PATH));
            
            return imgData;
        } catch (error) {
            console.log('[Service return modified error]: RETURN MODIFIED', error)

            throw error;
        }
    }
}

export const service = new Service();