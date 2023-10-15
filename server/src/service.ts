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

            console.log(canvas.width, canvas.height);


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
            
            console.log((await img).bitmap.height, (await img).bitmap.width);
            if ((await img).bitmap.width % pixelationFactor != 0){
                (await img).resize((await img).bitmap.width - ((await img).bitmap.width % pixelationFactor), (await img).bitmap.height);
            }
            if ((await img).bitmap.height % pixelationFactor != 0){
                (await img).resize((await img).bitmap.width, (await img).bitmap.height - ((await img).bitmap.height % pixelationFactor));
            }
            
            console.log((await img).bitmap.height, (await img).bitmap.width);
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

            // console.log(width, height)
            return {newImgData, width, height};
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

    async closestColor(targetColor:number[], colorArray:Array<number[]>){
        try {
            let closestDist = Number.MAX_VALUE;
            let closestColor = [0, 0, 0];

            colorArray.forEach((color) => {
                if (targetColor.toString() !== color.toString()){
                    const dist = Math.sqrt(
                        (targetColor[0] - color[0]) ** 2 + 
                        (targetColor[1] - color[1]) ** 2 + 
                        (targetColor[2] - color[2]) ** 2
                    );
    
                    // console.log('dist', dist)
        
                    if (dist < closestDist){
                        // console.log('here')
                        closestDist = dist;
                        closestColor = color;
                    }
                }
            })
            

            return closestColor
        } catch (error) {
            console.log('[Service closest color]:', error);

            throw error;
        }
    }


    async getImgData(imgData:string){
        try {
            console.log('img name',imgData);
            const image = await loadImage(`${process.env.SYSTEM_PATH}/${imgData}`);
            console.log('image', image);

            const canvas = createCanvas(image.width, image.height)
            const ctx = canvas.getContext('2d');

            const height = image.height;
            const width = image.width;

            ctx.drawImage(image, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            return {imageData, canvas, ctx};
        } catch (error) {
            console.log('[Service get image data]:', error);

            throw error;
        }
    }


    async changePixelColor(imgData:string, pixelationFactor:number, oldColor:[number, number, number], newColor:[number, number, number], colorArray:Array<number[]>){
        try {
            let {imageData, canvas, ctx} = await this.getImgData(imgData);
            
            for (let i = 0; i < imageData.data.length; i += 4){
                const color = [imageData.data[i], imageData.data[i+1], imageData.data[i+2]]
                const closestColor = await this.closestColor(color, colorArray);
                // console.log(closestColor, oldColor)
                if (closestColor.toString() === oldColor.toString()){
                    // console.log('yes', closestColor, oldColor);
                    imageData.data[i] = 204;
                    imageData.data[i + 1] = 50;
                    imageData.data[i + 2] = 218;

                    // console.log(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])

                }

            }
            ctx.putImageData(imageData, 0, 0);

            const data = canvas.toDataURL();

            return data;
        } catch (error) {
            console.log('[Service change pixel color]:', error);

            throw error;
        }
    }

    async changeColor(imgData:string, pixelationFactor:number, oldColor:[number, number, number], newColor:[number, number, number], colorArray:Array<number[]>){
        try {
            const result = await this.changePixelColor(imgData, pixelationFactor, oldColor, newColor, colorArray);

            return result;
        } catch (error) {
            console.log('[Service change color]:', error);

            throw error;
        }
    }
}

export const service = new Service();