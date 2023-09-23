import axios from 'axios';

// const API = axios.create({ baseURL: 'https://wallance.onrender.com/api' });
const API = axios.create({
  baseURL: import.meta.env.PROD ? 'https://wallance.onrender.com/api' : 'http://localhost:3000/api'
});


export default API;
