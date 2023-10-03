import { Service, service } from "./service";

export class Controller{
    constructor(
        private readonly service: Service
        ){};
}

export const controller = new Controller(service);