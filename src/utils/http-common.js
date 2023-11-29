import axios from 'axios';
import { getUserDetails } from './utility';
// eslint-disable-next-line
const baseUrl = process.env.REACT_APP_BASE_URL;
// eslint-disable-next-line
const localUrl = process.env.REACT_APP_LOCAL_URL;
export default axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-type': 'application/json',
    Authorization: getUserDetails()?.token,
    tenantid: getUserDetails()?.userid,
  },
});
