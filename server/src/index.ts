import { config } from "dotenv";
config();
import express from "express";
import { router } from "./router";
import cors from "cors";


const PORT = Number(process.env.PORT) || 3003;

function bootstrap(){
    try {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({
            extended: true,
        }));
        app.use(cors({
            credentials: true,
            origin: ['http://localhost:3000'],
        }));

        
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