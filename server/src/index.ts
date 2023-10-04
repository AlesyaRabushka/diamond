import { config } from "dotenv";
config();
import express from "express";
import { router } from "./router";


const PORT = Number(process.env.PORT) || 3003;

function bootstrap(){
    try {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({
            extended: true,
        }))
        console.log(Number(process.env.PORT) )
        app.use('/img', express.static('/img'))
        app.use('/', router);

        app.listen(PORT, () => {
            console.log(`[SERVER STARTED] server listen to http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error);

        throw error;
    }
}

bootstrap();