import {createCanvas, loadImage, ImageData} from "canvas";
import {writeFileSync, readFileSync, existsSync} from "fs";

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
            const img = await loadImage(path);

            const canvas = createCanvas(img.width, img.height)
            const ctx = canvas.getContext('2d');

            const heignht = img.height;
            const width = img.width;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const pixelsData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            
            // console.log(pixelsData)
            // ctx.putImageData(pixelsData, 0, 0);

            if (pixelationFactor !== 0){
                for (let y = 0; y < canvas.height; y+= pixelationFactor){
                    for(let x = 0; x < canvas.width; x += pixelationFactor){
                        const pixelIndexPosition = ( x + y * width) * 4;

                        ctx.fillStyle = `rgba(
                            ${pixelsData[pixelIndexPosition]},
                            ${pixelsData[pixelIndexPosition + 1]},
                            ${pixelsData[pixelIndexPosition + 2]},
                            ${pixelsData[pixelIndexPosition + 3]},
                            
                        )`;
                        ctx.fillRect(x, y, pixelationFactor, pixelationFactor);
                    }
                }
            }


            // const newData = await this.editImgData(pixelsData)
            // const c = canvas.toDataURL()
            // ctx.putImageData(c, 0, 0)
            const b = canvas.toDataURL();
            writeFileSync(String(process.env.IMG_MODIFIED_DATA_PATH), b);
            // console.log('b',b)
            // await this.saveImg(ctx, newData)
            
            return b;
        } catch (error) {
            console.log('[Service error]: MODIFY', error)

            throw error;
        }
    }

    async editImgData(imgData:ImageData){
        try {
            for (let i = 0; i < imgData.data.length; i += 4){
                imgData.data[i] = imgData.data[i] - 100;
                imgData.data[i + 1] = imgData.data[i + 1] - 100;
                imgData.data[i + 2] = imgData.data[i + 2] - 100;
            }
            // console.log(imgData)
            return imgData;
        } catch (error) {
            console.log('[Service error]: ', error)

            throw error;
        }
    }

    async saveImg(ctx:CanvasRenderingContext2D, imgData:ImageData){
        try {
            // ctx.putImageData(ImageData(imgData), 0, 0)
        } catch (error) {
            console.log('[Service error]: ', error)

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
            
            
            // console.log(imgData);
            return imgData;
        } catch (error) {
            console.log('[Service error]: RETURN IMG', error)

            throw error;
        }
    }

    async returnModifiedImg(){
        try {
            let imgData = '';
            if (existsSync(String(process.env.IMG_MODIFIED_DATA_PATH))){
                imgData = readFileSync(String(process.env.IMG_MODIFIED_DATA_PATH), 'utf-8');
                console.log('here in modified!')
            }
            
            return imgData;
        } catch (error) {
            console.log('[Service error]: RETURN MODIFIED', error)

            throw error;
        }
    }
}

export const service = new Service();