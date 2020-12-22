import axios from 'axios';

//need instance for json and xml
const Instance = {
  axiosInstance(contentType = 'text/xml') {
    const instance = axios.create({
      timeout: 15000,
      headers: this.getHeader(contentType),
    });
    return instance;
  },
  getHeader(contentType = 'text/xml') {
    const API_HEADER = {
      'Content-Type': contentType,
    };
    return API_HEADER;
  },
};

export default Instance;
