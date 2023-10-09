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

            return response;
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
    static async returnModifiedImg(){
        try {
            const response = await $host.get('/returnModifiedImg');

            return response.data;
        } catch (error) {
            console.log('[ClientService] error:', error);
            throw error;
        }
    }
}