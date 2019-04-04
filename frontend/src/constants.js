const USE_REMOTE_REPLACES = true;
export const BACKEND_HOST = process.env.NODE_ENV === 'development' && !USE_REMOTE_REPLACES
    ? 'http://localhost:8000'
    : 'https://yofication.herokuapp.com';

export const YO_IMAGE_URL_22 = 'https://yofication.herokuapp.com/static/yo_22.png';
export const YO_IMAGE_URL_20 = 'https://yofication.herokuapp.com/static/yo_20.png';
