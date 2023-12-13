const USE_REMOTE_REPLACES = true;
export const BACKEND_HOST = process.env.NODE_ENV === 'development' && !USE_REMOTE_REPLACES
    ? 'http://localhost:8000'
    : 'https://yofication.fly.dev';

export const YO_IMAGE_URL_22 = 'https://yofication.fly.dev/static/yo_22.png';
export const YO_IMAGE_URL_20 = 'https://yofication.fly.dev/static/yo_20.png';

export const IS_MOBILE_SITE = window.location.hostname.includes('.m.wikipedia');
export const IS_MOBILE_DEVICE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
