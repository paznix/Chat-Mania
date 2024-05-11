import axios from 'axios';
// config
import { FEUrl } from './feUrl';
import { BaseUrl } from './Baseurl';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BaseUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
