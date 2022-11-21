import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || '8080';
export const AUTH_UID = process.env['UID'];
export const AUTH_SECRET = process.env['SECRET'];
export const FRONT = process.env['FRONT'] || 'http://localhost:5173';
export const BACK = process.env['BACK'] || 'http://localhost:8080';
export const MODE = process.env.MODE || 'DEV';
