import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || '8080';
export const DB_URL = process.env.DB_URL;
export const AUTH_UID = process.env['42_UID'];
export const AUTH_SECRET = process.env['42_SECRET'];
