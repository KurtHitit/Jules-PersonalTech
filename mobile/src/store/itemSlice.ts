// mobile/src/store/itemSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as itemService from '../services/itemService';
import { Item } from '../../../backend/src/models/Item';

interface ItemState {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (searchQuery?: string) => {
    const response = await itemService.fetchItems(searchQuery);
    return response;
  }
);

export const addItem = createAsyncThunk(
  'items/addItem',
  async (itemData: itemService.NewItemData) => {
    const response = await itemService.addItem(itemData);
    return response;
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ itemId, updates }: { itemId: string; updates: itemService.NewItemData }) => {
    const response = await itemService.updateItem(itemId, updates);
    return response;
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (itemId: string) => {
    await itemService.deleteItem(itemId);
    return itemId;
  }
);

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default itemSlice.reducer;
