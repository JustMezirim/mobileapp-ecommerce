import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const ENV = {
    NODE_ENV:process.env.NODE_ENV,
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
}