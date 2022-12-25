const USE_REMOTE_REPLACES = true;
export const BACKEND_HOST = process.env.NODE_ENV === 'development' && !USE_REMOTE_REPLACES
    ? 'http://localhost:8000'
    : 'https://yofication-diralik.amvera.io';

export const YO_IMAGE_URL_22 = 'https://yofication-diralik.amvera.io/static/yo_22.png';
export const YO_IMAGE_URL_20 = 'https://yofication-diralik.amvera.io/static/yo_20.png';

export const IS_MOBILE_SITE = window.location.hostname.includes('.m.wikipedia');
export const IS_MOBILE_DEVICE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
