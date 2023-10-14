import axios from 'axios';

const baseURL = import.meta.env.HOST ?? 'http://localhost:3000/api';

const API = axios.create({
  baseURL
});

export default API;
