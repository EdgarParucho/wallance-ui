import axios from 'axios';

const baseURL = import.meta.env.DEV ? "http://localhost:3000/api" : import.meta.env.VITE_API;

const API = axios.create({
  baseURL,
});

export default API;
