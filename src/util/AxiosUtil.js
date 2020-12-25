import axios from 'axios';

//need instance for json and xml
const Instance = {
  axiosInstance(contentType = 'application/json') {
    const instance = axios.create({
      timeout: 15000,
      headers: this.getHeader(contentType),
    });
    return instance;
  },
  getHeader(contentType = 'application/json') {
    const API_HEADER = {
      'Content-Type': contentType,
      // 'DHL-API-Key': process.env.REACT_APP_DHL_API_USERNAME,
    };
    return API_HEADER;
  },
};

export default Instance;
