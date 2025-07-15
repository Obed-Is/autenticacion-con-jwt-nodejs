import express from 'express';
import path from 'node:path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import env from 'dotenv/config';
import router from './routes/user.routes.js';

const app = express();
const __dirname = import.meta.dirname;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(router);

const portApp = process.env.APP_PORT || 4000;

app.listen(portApp, () => {
    console.log(`servidor corriento en el puerto: ${portApp}\nhttp://localhost:${portApp}/login`);
})

export default app;