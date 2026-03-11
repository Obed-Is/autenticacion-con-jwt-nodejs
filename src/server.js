import express from 'express';
import path from 'node:path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import env from 'dotenv/config';
import router from './routes/user.routes.js';

const app = express();
// para confiar en el proxy de render
app.set("trust proxy", 1);
const __dirname = import.meta.dirname;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(router);

const portApp = process.env.PORT || 4000;

app.listen(portApp, () => {
    console.log(`servidor corriento en el puerto: ${portApp}\nhttp://localhost:${portApp}/home`);
})

app.use((req, res) => res.status(404).render(path.join(__dirname, "./views/notFound.ejs")));

export default app;