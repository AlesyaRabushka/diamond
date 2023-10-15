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

            const result = await this.service.modifyImg(path, Number(request.body.pixelationFactor));

            response.status(201).json(result);
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
            
            const result = await this.service.returnModifiedImg(request.body.imgName);

            response.status(200).json(result);
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    };

    async verifyColors(request:Request, response:Response){
        try {
            console.log('controller verify',request.body.imgName)
            const result = await this.service.verifyColors(request.body.imgName, Number(request.body.colorAmount));
            response.status(201).json(result);
        } catch (error) {
            console.log('[Controller error]: VERIFY COLORS', error);

            throw error;
        }
    }

    // async verify(request:Request, response:Response){
    //     try {
    //         const result = await this.service.verify(request.body.imgName, Number(request.body.colorAmount));

    //         response.status(201).json(result)
    //     } catch (error) {
    //         console.log('[Controller error]: ', error);

    //         throw error;
    //     }
    // }

    async changeColor(request:Request, response:Response){
        try {
            const result = await this.service.changeColor(request.body.imgData, request.body.pixelationFactor, request.body.oldColor, request.body.newColor, request.body.colorArray);

            response.status(201).json(result)
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    }
}

export const controller = new Controller(service);