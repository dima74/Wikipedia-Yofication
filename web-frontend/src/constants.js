export const BACKEND_HOST = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5000/wikipedia'
    : 'https://yofication.herokuapp.com/wikipedia';

export const YO_IMAGE_URL_22 = 'https://yofication.herokuapp.com/static/yo_22.png';
export const YO_IMAGE_URL_20 = 'https://yofication.herokuapp.com/static/yo.png';

export const WIKTIONARY_REDIRECT_URL = BACKEND_HOST + '/redirectToWiktionaryArticle/';
