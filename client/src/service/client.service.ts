import $host from "../http/http";


export class Service{
    static async getImg(path:string){
        try {
            const response = await $host.post('/convert', {path});

            return response;
        } catch (error) {
            console.log('[Client Service}: error ', error);

            throw error;
        }
    }
}