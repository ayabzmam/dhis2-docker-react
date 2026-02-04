import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // proxy will forward to http://localhost:8080/api
  auth: {
    username: 'admin',
    password: 'district'
  }
});

export default api;
