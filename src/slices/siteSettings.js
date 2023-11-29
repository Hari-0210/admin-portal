import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SiteService from '../services/SiteService';

const initialState = {
  settings: [],
};

export const fetchSiteSettings = createAsyncThunk('store/fetchSiteSettings', async (data) => {
  const res = await SiteService.fetchSettings(data);
  return res.data;
});

const siteSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSiteSettings.fulfilled, (state, action) => {
      state.settings = action.payload.data.data;
    });
  },
});

const { reducer } = siteSlice;
export default reducer;
