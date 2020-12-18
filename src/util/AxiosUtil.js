import axios from 'axios';

const Instance = {
  axiosInstance(contentType = 'application/json') {
    const instance = axios.create({
      baseURL: process.env.BASE_URL,
      timeout: 15000,
      headers: this.getHeader(contentType),
    });
    return instance;
  },
  getHeader(contentType = 'application/json') {
    const API_HEADER = {
      'Content-Type': contentType,
    };
    return API_HEADER;
  },
};

export default Instance;
