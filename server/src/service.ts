export class Service{
    constructor(){};

    async uploadImg(){
        try {
            let img = '/home/aleksa/Загрузки/10+ Best Rick and Morty Wallpapers HD.png'
            
        } catch (error) {
            console.log('[Service error]: ', error);

            throw error;
        }
    }
}

export const service = new Service();