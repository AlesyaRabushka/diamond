import { Service, service } from "./service";
import { Request, Response } from "express";

export class Controller{
    constructor(
        private readonly service: Service
        ){};


    async uploadImg(request:Request, response:Response){
        try {
            // const result = await this.service.uploadImg()
            
            console.log(Number(process.env.PORT))

            return response.status(201).json({
                img_url: `http://localhost:${Number(process.env.PORT)}/img/${request.file?.filename}`
            })
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
}

export const controller = new Controller(service);