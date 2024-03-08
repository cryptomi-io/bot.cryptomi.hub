import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import process from 'process';
import cors from 'cors'
import { CronSchedule } from './modules/cron/cron.module.js';
import router from './router.js';


dotenv.config()

const app = express()
const PORT = process.env.PORT || 4005;
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use('/api', router);

CronSchedule.run()

const start = async () => {
    try {
        app.listen(PORT, () => {console.log(`Server started on port ${PORT}...`)});
    } catch (e) {
        console.log(e);
    }
}

start();
