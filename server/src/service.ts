import {createCanvas, loadImage, ImageData} from "canvas";
import {writeFileSync, readFileSync, existsSync, unlinkSync} from "fs";

import {read} from "jimp";

import { prominent } from "./colorsPallete";

// import {prominent} from "colors.js"

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
            // remove img
            // unlinkSync(path);


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

    async verifyColors(imgName: string, colorAmount: number){
        try {
            const path = `${process.env.SYSTEM_PATH}/${imgName}`;
            console.log('path', path);

            let colors = await prominent(path, {amount: colorAmount});
            console.log(colors);

            return colors;
        } catch (error) {
            console.log('[Service error]: verify colors', error)

            throw error;
        }
    }

    async findBiggestColorRange(rgbValues: {r:number, g:number, b:number}[]){
        try {
            let rMin = Number.MAX_VALUE;
            let gMin = Number.MAX_VALUE;
            let bMin = Number.MAX_VALUE;

            let rMax = Number.MIN_VALUE;
            let gMax = Number.MIN_VALUE;
            let bMax = Number.MIN_VALUE;

            rgbValues.forEach((pixel) => {
                rMin = Math.min(rMin, pixel.r);
                gMin = Math.min(gMin, pixel.g);
                bMin = Math.min(bMin, pixel.b);

                rMax = Math.max(rMax, pixel.r);
                gMax = Math.max(gMax, pixel.g);
                bMax = Math.max(bMax, pixel.b);
            });


            const rRange = rMax - rMin;
            const gRange = gMax - gMin;
            const bRange = bMax - bMin;

            const biggestRange = Math.max(rRange, gRange, bRange);
            if (biggestRange == rRange){
                return 'r'
            } else if (biggestRange == gRange){
                return 'g'
            } else if (biggestRange == bRange){
                return 'b'
            }

            return 'b'

        } catch (error) {
            console.log('[Service biggest color range]:', error)

            throw error;
        }
    }


    async defineColors(rgbValues:{r:number, g:number, b:number}[], colorsAmount:number, depth:number) : Promise<{r:number, g:number, b:number}[]>{
        try {
            if (depth == colorsAmount || rgbValues.length === 0){
                const color = rgbValues.reduce((prev, curr) => {
                    prev.r += curr.r;
                    prev.g += curr.g;
                    prev.b += curr.b;

                    return prev;
                }, {r:0, g:0, b:0});

                color.r = Math.round(color.r / rgbValues.length);
                color.g = Math.round(color.g / rgbValues.length);
                color.b = Math.round(color.b / rgbValues.length);

                return [color];
            }

            const rgbToSortBy = await this.findBiggestColorRange(rgbValues);
            rgbValues.sort((pixel1, pixel2) => {
                return pixel1[rgbToSortBy] - pixel2[rgbToSortBy];
            });

            const mid = rgbValues.length / 2;

            return [
                ...await this.defineColors(rgbValues.slice(0, mid), colorsAmount, depth+1),
                ...await this.defineColors(rgbValues.slice(mid + 1), colorsAmount, depth+1),
            ];


        } catch (error) {
            console.log('[Service define colors]:', error);

            throw error;
        }
    }

    async verify(imgName:string, colorAmount:number){
        try {
            const image = await loadImage(`${process.env.SYSTEM_PATH}/${imgName}`);
            console.log('image', image);

            const canvas = createCanvas(image.width, image.height)
            const ctx = canvas.getContext('2d');

            const height = image.height;
            const width = image.width;

            ctx.drawImage(image, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const rgbValues = [];
            for (let i = 0; i < imageData.data.length; i+= 4){
                const rgb = {
                    r: imageData.data[i],
                    g: imageData.data[i + 1],
                    b: imageData.data[i + 2],
                };
                rgbValues.push(rgb);
            }

            const colors = await this.defineColors(rgbValues, colorAmount, colorAmount);

            console.log(colors);


        } catch (error) {
            console.log('[Service verify color]:', error);

            throw error;
        }
    }
}

export const service = new Service();