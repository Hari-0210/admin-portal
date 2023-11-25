import http from '../utils/http-common';

const fetchProducts = (data) => http.post('/product/fetch', data);
const uploadImg = (data) =>
  http.post('/product/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

const ProductService = {
  fetchProducts,
  uploadImg,
};

export default ProductService;
