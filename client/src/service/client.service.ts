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

    // return original image
    static async returnImg(){
        try {
            const response = await $host.get('/returnImg');

            console.log('response',response.data);

            return response.data;
        } catch (error) {
            console.log('[ClientService] error:', error);
            throw error;
        }
    }

    // return modified image
    static async returnModifiedImg(imgName:string){
        try {
            console.log('in return modified', imgName);
            const response = await $host.post('/returnModifiedImg', {imgName});
            console.log('return modified data',response.data);
            return response.data;
        } catch (error) {
            console.log('[ClientService] error:', error);
            throw error;
        }
    }

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
}