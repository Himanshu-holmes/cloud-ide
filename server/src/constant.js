const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME; 
 const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const DB_NAME = 'reel'
const DB_URI = process.env.MONGODB_URI

const CORS_ORIGIN = "*";
let count = 0;

const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY=process.env;
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY=process.env.REFRESH_TOKEN_EXPIRY;
module.exports = {
    PORT,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    DB_NAME,
    DB_URI,
    CORS_ORIGIN,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
    count
    };