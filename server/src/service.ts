export class Service{
    constructor(){};

    async uploadImg(){
        try {
            
        } catch (error) {
            console.log('[Service error]: ', error);

            throw error;
        }
    }
}

export const service = new Service();