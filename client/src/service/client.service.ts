import { AxiosResponse } from "axios";
import $host from "../http/http";


export class ClientService{
    // upload to db
    static async uploadImg(imgData: FormData){
        try {
            const response = await $host.post('/upload', imgData, 
            {headers:{
                "Content-Type":"multipart/form-data"
            }});
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log('[ClientService] error:', error);
            throw error;
        }
    }

    // modify image
    static async modifyImg(imgName: string, pixelationFactor:number){
        try {
            console.log('in modify', imgName, pixelationFactor)
            const response = await $host.post('/modify', {imgName, pixelationFactor})
            console.log('res data', response.data);
            return response.data;
        } catch (error) {
            console.log('[ClientService] error:', error);
            throw error;
        }
    }

    // modify image v2
    static async modifyImgV2(file: File, pixelationFactor: number){
        try {
            const data = new FormData();

            data.append('image', file);
            data.append('pixelationFactor', String(pixelationFactor));
            
            const response = await $host.post('/modify-v2', data)

            console.log(response.data);

            return response.data;
        } catch (error) {
            console.log('[ClientService] in modifyImgV2 error:', error);
            throw error;
        }
    }

    static async verifyColorsV2(file:File, colorAmount:number){
        try {
            const data = new FormData();

            data.append('image', file);
            data.append('colorAmount', String(colorAmount));
            console.log('data sent')
            const response = await $host.post('/verifyColors-v2', data);
            console.log('verify', response.data);

            return response.data;
        } catch (error) {
            console.log('[ClientService] verify v2 derror:', error);
            throw error;
        }
    }

    // return original image
    // static async returnImg(){
    //     try {
    //         const response = await $host.get('/returnImg');

    //         console.log('response',response.data);

    //         return response.data;
    //     } catch (error) {
    //         console.log('[ClientService] error:', error);
    //         throw error;
    //     }
    // }

    // // return modified image
    // static async returnModifiedImg(imgName:string){
    //     try {
    //         console.log('in return modified', imgName);
    //         const response = await $host.post('/returnModifiedImg', {imgName});
    //         console.log('return modified data',response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.log('[ClientService] error:', error);
    //         throw error;
    //     }
    // }

    static async verifyColors(imgName:string, colorAmount:number){
        try {
            console.log(imgName)
            const response = await $host.post('/verifyColors', {imgName, colorAmount});
            console.log('verify', response.data);

            return response.data;
        } catch (error) {
            console.log('[ClientService] error:', error);
            throw error;
        }
    }


    static async colorChange(imgData:string, pixelationFactor:number, oldColor: [number, number, number], newColor:[number, number, number], colorArray:Array<number[]>){
        try {
            console.log('array',colorArray)
            const response = await $host.post('/change-color', {imgData, pixelationFactor, oldColor, newColor, colorArray});

            console.log('response',response)

            return response.data;
        } catch (error) {
            console.log('[ClientService] color change:', error);
            throw error;
        }
    }
}