import http from '../utils/http-common';

const fetchSettings = (data) => http.post('/store/fetchSettings', data);

const SiteService = {
  fetchSettings,
};
export default SiteService;
