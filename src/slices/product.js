import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProductService from '../services/ProductService';

const initialState = {
  products: [],
  img: [],
};

export const fetchProducts = createAsyncThunk('products/fetch', async (data) => {
  const res = await ProductService.fetchProducts(data);
  return res.data;
});
export const uploadImageApi = createAsyncThunk('products/imgUpload', async (data) => {
  const res = await ProductService.uploadImg(data);
  return res.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload.data.data;
    });
    builder.addCase(uploadImageApi.fulfilled, (state, action) => {
      state.img = action.payload.data.data;
    });
  },
});

const { reducer } = productsSlice;
export default reducer;
