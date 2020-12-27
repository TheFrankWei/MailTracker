import axios from 'axios';

const upsKey = process.env.REACT_APP_UPS_API_KEY;
const upsUsername = process.env.REACT_APP_UPS_USERNAME;
const upsPassword = process.env.REACT_APP_UPS_PASSWORD;

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
      'transId': '12345',
      'transactionSrc': 'MailTracker',
      'AccessLicenseNumber': `${upsKey}`,
      // 'Username': `${upsUsername}`,
      // 'Password': `${upsPassword}`,

    };
    return API_HEADER;
  },
};

export default Instance;
