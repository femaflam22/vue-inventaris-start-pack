export const API_BASE_URL = 'http://45.64.100.26:88/API-Lumen/public';

let userNonFormatted = localStorage.getItem('user');
let accessTokenNonFormatted = localStorage.getItem('access_token');
export const USER = userNonFormatted ? JSON.parse(userNonFormatted) : null;
export const ACESS_TOKEN = accessTokenNonFormatted ? accessTokenNonFormatted : null;