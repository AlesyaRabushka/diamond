import { Service, service } from "./service";
import { Request, Response } from "express";

export class Controller{
    constructor(
        private readonly service: Service
        ){};


    async uploadImg(request:Request, response:Response){
        try {
            const result = await this.service.uploadImg()
        } catch (error) {
            console.log('[Controller error]: ', error);

            throw error;
        }
    }
}

export const controller = new Controller(service);