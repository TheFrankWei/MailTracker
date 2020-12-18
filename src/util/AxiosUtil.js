import axios from 'axios';

//need instance for json and xml
const Instance = {
  axiosInstance(contentType = 'application/xml') {
    const instance = axios.create({
      baseURL: process.env.BASE_URL,
      timeout: 15000,
      headers: this.getHeader(contentType),
    });
    return instance;
  },
  getHeader(contentType = 'application/xml') {
    const API_HEADER = {
      'Content-Type': contentType,
    };
    return API_HEADER;
  },
};

export default Instance;
