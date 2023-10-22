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

    async modifyImgV2(file:Express.Multer.File, pixelationFactor:number){
        try {
            // console.log('heere')
            if (pixelationFactor == 0){
                return 'data:image/png;base64,' + file.buffer.toString('base64'); 
              }
              
              const img = await read(file.buffer);
  
              if ((img).bitmap.width % pixelationFactor != 0){
                  (img).resize((img).bitmap.width - ((img).bitmap.width % pixelationFactor), (img).bitmap.height);
              }
              if ((img).bitmap.height % pixelationFactor != 0){
                  (img).resize((img).bitmap.width, (img).bitmap.height - ((img).bitmap.height % pixelationFactor));
              }
  
              const buffer = await img.pixelate(pixelationFactor).getBufferAsync('image/png')
            //   console.log('data:image/png;base64,' + buffer.toString('base64'))
            const data = 'data:image/png;base64,' + buffer.toString('base64')
            const height = img.bitmap.height;
            const width = img.bitmap.width;

              return {data, width, height}; 
        } catch (error) {
            console.log('[Service error]: MODIFY', error)

            throw error;
        }
    }



    // async returnImg(){
    //     try {
    //         let imgData = '';
    //         if (existsSync(String(process.env.IMG_ORIGINAL_DATA_PATH))){
    //             console.log('find file!')
    //             imgData = readFileSync(String(process.env.IMG_ORIGINAL_DATA_PATH), 'utf-8');
    //         }
            
    //         return imgData;
    //     } catch (error) {
    //         console.log('[Service error]: RETURN IMG', error)

    //         throw error;
    //     }
    // }

    // async returnModifiedImg(imgName:string){
    //     try {
    //         console.log('return modified', `${process.env.SYSTEM_PATH}/${imgName}`)
            
    //         const pixelatedImg = await loadImage(`${process.env.SYSTEM_PATH}/${imgName}`);
    //         const canvas = createCanvas(pixelatedImg.width, pixelatedImg.height)
    //         const ctx = canvas.getContext('2d');

    //         const height = pixelatedImg.height;
    //         const width = pixelatedImg.width;

    //         ctx.drawImage(pixelatedImg, 0, 0, width, height);
    //         const newImgData = canvas.toDataURL('image/jpeg');

    //         // console.log(width, height)
    //         return {newImgData, width, height};
    //     } catch (error) {
    //         console.log('[Service return modified error]: RETURN MODIFIED', error)

    //         throw error;
    //     }
    // }

    async verifyColors(imgName: string, colorAmount: number){
        try {
            const path = `${process.env.SYSTEM_PATH}/${imgName}`;
            console.log('path', path);

            // let colors = await prominent(path, {amount: colorAmount});
            // console.log(colors);

            return [];
        } catch (error) {
            console.log('[Service error]: verify colors', error)

            throw error;
        }
    }


    async verifyColorsV2(file: Express.Multer.File, colorAmount: number){
        try {
            const colors = await prominent(file.buffer, {amount: colorAmount});

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


    async getImgData(imageBuffer: Buffer){
        try {
            console.log('img name',imageBuffer);
            const image = await loadImage(imageBuffer);
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


    async changePixelColor(imageBuffer: Buffer, pixelationFactor:number, oldColor:Array<number>, newColor:Array<number>, colorArray:Array<number[]>, changedArray:Array<number[]>){
        try {
            let {imageData, canvas, ctx} = await this.getImgData(imageBuffer);
            // console.log('id',imageData.data)
            // for (let pixelBoxIndex = 0; pixelBoxIndex < imageData.data.length / pixelationFactor; pixelBoxIndex += pixelationFactor){
            //     const color = [imageData.data[pixelBoxIndex], imageData.data[pixelBoxIndex + 1], imageData.data[pixelBoxIndex + 2]]
            //     const closestColor = await this.closestColor(color, colorArray);
            //     if (closestColor.toString() === oldColor.toString()){

                console.log('NEW COLOR', newColor)
                console.log(changedArray)
                console.log(changedArray.includes(newColor))

            const allArray = JSON.stringify(changedArray)
            const oldColorStr =  JSON.stringify(oldColor);

            // check if the color needed to be RESET 
            const rechange = allArray.includes(oldColorStr)


            for (let i = 0; i < imageData.data.length; i += 4){
                const color = [imageData.data[i], imageData.data[i+1], imageData.data[i+2]];
                // console.log(color)
                // for (let j = 0; j < changedArray.length; j++){
                    // if (!arr.includes(color)) arr.push(color)
                    const colorStr = JSON.stringify(color)
                    if (rechange){
                        if (colorStr === oldColorStr){
                            imageData.data[i] = newColor[0];
                            imageData.data[i + 1] = newColor[1];
                            imageData.data[i + 2] = newColor[2];
                        }
                    }
                    else if (allArray.includes(colorStr)){
                        // console.log('YES',color)
                        continue
                    } else{
                        const closestColor = await this.closestColor(color, colorArray);
                        
                        if (closestColor.toString() === oldColor.toString()){
                            imageData.data[i] = newColor[0];
                            imageData.data[i + 1] = newColor[1];
                            imageData.data[i + 2] = newColor[2];
                        }
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

    // async changeColor(imgData:string, pixelationFactor:number, oldColor:[number, number, number], newColor:[number, number, number], colorArray:Array<number[]>){
    //     try {
    //         const result = await this.changePixelColor(imgData, pixelationFactor, oldColor, newColor, colorArray, );

    //         return result;
    //     } catch (error) {
    //         console.log('[Service change color]:', error);

    //         throw error;
    //     }
    // }

    async changeColorV2(file:Express.Multer.File, pixelationFactor:number, oldColorStr:Array<string>, newColorStr:Array<string>, colorArrayStr:Array<string>, alreadyChanged:Array<string>){
        try {

            const oldColor = oldColorStr.map(item => parseInt(item, 10));
            const newColor = newColorStr.map(item => parseInt(item, 10));
            let colorArray:Array<number[]> = [];
            
            for (let i = 0 ; i < colorArrayStr.length; i ++){
                const arr = colorArrayStr[i].split(',').map(item => parseInt(item, 10));
                colorArray.push(arr)
            }
            let changedArray:Array<number[]> = [];
            // console.log('already ',Array(alreadyChanged))
            if (alreadyChanged.length != 0){
                for (let i = 0 ; i < alreadyChanged.length; i ++){
                    const arr = alreadyChanged[i].split(',')
                    const arr1 = arr.map(item => parseInt(item, 10));
                    // console.log('arr', arr1)
                    changedArray.push(arr1)
                }
            } 

            changedArray.push(newColor);
            // console.log('changed array', changedArray, changedArray.length)
            
            const result = await this.changePixelColor(file.buffer, pixelationFactor, oldColor, newColor, colorArray, changedArray);

            return {result, changedArray};
        } catch (error) {
            console.log('[Service change color]:', error);

            throw error;
        }
    }

    
}

export const service = new Service();