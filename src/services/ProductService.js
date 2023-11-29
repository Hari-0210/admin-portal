import http from '../utils/http-common';

const fetchProducts = (data) => http.post('/product/fetch', data);
const uploadImg = (data) =>
  http.post('/product/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
const fetchProductImg = (data) => http.post('/product/img', data);

const ProductService = {
  fetchProducts,
  uploadImg,
  fetchProductImg,
};

export default ProductService;
