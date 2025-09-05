import { config } from 'dotenv';
import App from './app';

config();

const PORT = Number(process.env.PORT) || 3000;
const app = new App(PORT);
app.listen();
