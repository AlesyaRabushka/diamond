import { Service, service } from "./service";
import { Request, Response } from "express";

export class Controller{
    constructor(
        private readonly service: Service
        ){};


    async uploadImg(request:Request, response:Response){
        try {
            // console.log('controller', request.body.fileData)
            const result = await this.service.uploadImg(String(request.file?.filename));
            console.log('constroller', request.file?.filename)

            return response.status(201).json(request.file?.filename);
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    }

    async getImg(request:Request, response:Response){
        try {
            response.status(200).json()
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    }

    async modifyImg(request:Request, response:Response){
        try {
            console.log(request.body.pixelationFactor, request.body.imgName)
            
            const path = `${process.env.SYSTEM_PATH}/${request.body.imgName}`
            console.log(path)

            const result = await this.service.modifyImg(path, Number(request.body.pixelationFactor)).then((pixels) => {
                // console.log(pixels)
            })

            response.status(201).json('result');
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    }


    async returnImg(request:Request, response:Response){
        try {
            const result = await this.service.returnImg();

            response.status(200).json(result)
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    }

    async returnModifiedImg(request:Request, response:Response){
        try {
            
            const result = await this.service.returnModifiedImg();

            response.status(200).json(result);
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    }
}

export const controller = new Controller(service);