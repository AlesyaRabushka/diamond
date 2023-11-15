import {createCanvas, loadImage, ImageData} from "canvas";
import {writeFileSync, readFileSync, existsSync, unlinkSync} from "fs";

import {read} from "jimp";

import { prominent } from "./colorsPallete";
import { getColorPallete } from "./colors.pallete";
import { TypePredicateKind } from "typescript";

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

                console.log('NEW COLOR', newColor)
                console.log(changedArray)
                console.log(changedArray.includes(newColor))

            const allArray = JSON.stringify(changedArray)
            const oldColorStr =  JSON.stringify(oldColor);

            // check if the color needed to be RESET 
            const rechange = allArray.includes(oldColorStr)


            for (let i = 0; i < imageData.data.length; i += 4){
                const color = [imageData.data[i], imageData.data[i+1], imageData.data[i+2]];
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
            
            if (alreadyChanged.length != 0){
                for (let i = 0 ; i < alreadyChanged.length; i ++){
                    const arr = alreadyChanged[i].split(',')
                    const arr1 = arr.map(item => parseInt(item, 10));
                    
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




    //////////////////////////////////////////////////////////////////////////////////////

    async changePixelColorV3(imageBuffer: Buffer, oldColors:any, newColors:any){
        try {
            let {imageData, canvas, ctx} = await this.getImgData(imageBuffer);


            for (let i = 0; i < imageData.data.length; i += 4){
                const color = [imageData .data[i], imageData.data[i+1], imageData.data[i+2]];
                
                    const colorStr = JSON.stringify(color)

                    for (let j = 0; j < oldColors.length; j++){
                        let oldColor = oldColors[j];
                        let oldColorIndex = oldColors.indexOf(oldColor);
                        let oldColorStr = JSON.stringify(oldColor);

                        if (colorStr === oldColorStr){
                            imageData.data[i] = newColors[oldColorIndex][0];
                            imageData.data[i + 1] = newColors[oldColorIndex][1];
                            imageData.data[i + 2] = newColors[oldColorIndex][2];
                        }
                        else{
                                const closestColor = await this.closestColor(color, oldColors);
                                
                                if (closestColor.toString() === oldColor.toString()){
                                    imageData.data[i] = newColors[oldColorIndex][0];
                                    imageData.data[i + 1] = newColors[oldColorIndex][1];
                                    imageData.data[i + 2] = newColors[oldColorIndex][2];
                                }
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


    

    // define the value of the closest color distance
    async defineClosestColorsDistance(color1:Array<number>, color2:Array<number>){
        try {
            let closestDist = Number.MAX_VALUE;

            const dist = Math.sqrt(
                (color2[0] - color1[0]) ** 2 + 
                (color2[1] - color1[1]) ** 2 + 
                (color2[2] - color1[2]) ** 2
            );
            if (dist < closestDist){
                closestDist = dist;
            }
                
            return closestDist;
        } catch (error) {
            console.log('[Service] defineColorsDistance error', error);

            throw error;
        }
    }

    // get min distances out of Min Distances arrays
    getMinDistances(index:number, rowsArray:Array<number[]>, colsArray:Array<number[]>, takenIndexes: Array<[] | number>){
        try {
            let result = Object.create(null);
            // let takenIndexes: Array<number> = [];

            for (let i = index; i < rowsArray.length; i++){
                let rowMin = Math.min(...rowsArray[i]);

                let minIndex = rowsArray[i].indexOf(rowMin);

                if (!takenIndexes.includes(minIndex)){
                    let colMin = Math.min(...colsArray[minIndex]);

                    if (rowMin == colMin){
                        console.log('match',rowMin)
                        takenIndexes.push(minIndex)
                        result[i] = minIndex
                        // return rowMin
                    } else{
                        
                        
                    }
                } else{
                    console.log('don\'t match');
                    let found = false
                    let arr = rowsArray[i].filter(item => item);
                    console.log(rowsArray[i]);

                    while(!found){
                        arr[minIndex] = Number.MAX_SAFE_INTEGER;
                        console.log('arr',arr);

                        rowMin = Math.min(...arr);
                        console.log('row min', rowMin);
                        minIndex = arr.indexOf(rowMin);
                        if (takenIndexes.includes(minIndex)){
                            console.log('already taken')
                        } else{
                            console.log('match', rowMin)
                            takenIndexes.push(minIndex)
                            result[i] = minIndex
                            found = true
                        }

                    }
                }
                
            }

            return result;
        } catch (error) {
            console.log('[getMinDistances] error', error);

            throw error;
        }
    }

    // define the new color for each of the old ones
    async getNewColorPallete(originalColorsPallete:any, newColorPallete:any){
        try {
            let distancesArray = [];
            

            // define all min distnaces between each of the old colors and each of the new ones
            for (let i = 0; i < originalColorsPallete.length; i++){
                let colorDistanceArray = [];
                for (let j = 0; j < newColorPallete.length; j++){
                    const colorDist = await this.defineClosestColorsDistance(originalColorsPallete[i], newColorPallete[j]);
                    colorDistanceArray.push(colorDist);
                }
                distancesArray.push(colorDistanceArray);
            }

            console.log('array', distancesArray)


            // define min distnace for each color distance
            let minDistancesArray = [];

            function transpose(a:any) {
                return Object.keys(a[0]).map(function(c) {
                    return a.map(function(r:any) { return r[c]; });
                });
            }

            let distancesArrayTransposed = transpose(distancesArray);

            // distancesArray = [[8,4,1], [0,7,9], [1,3,2]]
            // distancesArrayTransposed = transpose(distancesArray)

            const result = await this.getMinDistances(0, distancesArray, distancesArrayTransposed, []);
            console.log('done');
            let oldColors:Array<number> = [];
            let newColors:Array<number> = [];

            let newPallete = Object.create(null)
            for (let [key, value] of Object.entries(result)){
                console.log(key, value);
                oldColors.push(originalColorsPallete[Number(key)]);
                newColors.push(newColorPallete[Number(value)]);
                // newPallete[`${originalColorsPallete[Number(key)]}`] = `${newColorPallete[Number(value)]}`;
            }

            

            return {oldColors, newColors};

        } catch (error) {
            console.log('[Service] getNewColorPalllete error', error);

            throw error;
        }
    }

    async changeColorV3(file:Express.Multer.File, pixelationFactor:number, colorsAmount:number){
        try {

            // original picture colors
            const originalColorsPallete = await this.verifyColorsV2(file, colorsAmount);
            console.log(typeof originalColorsPallete)

            const newColorsPallete = getColorPallete(colorsAmount);
            console.log(typeof newColorsPallete)

            const {oldColors, newColors} = await this.getNewColorPallete(originalColorsPallete, newColorsPallete);

            

            const result = await this.changePixelColorV3(file.buffer, oldColors, newColors);

            // console.log(result);
            let changedArray = ['lal'];
            console.log('done')

            return result;
            
        } catch (error) {
            console.log('[Service change color]:', error);

            throw error;
        }
    }
}

export const service = new Service();