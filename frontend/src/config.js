const hostname = window.location.hostname;
const API_BASE_URL = hostname === '31.97.237.122'
  ? 'http://31.97.237.122:5003'
  : `http://${hostname}:5000`;

export default API_BASE_URL;
