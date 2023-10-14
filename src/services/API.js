import axios from 'axios';

const API = axios.create({
  baseURL: 'https://wallance.onrender.com/api',
});

export default API;
