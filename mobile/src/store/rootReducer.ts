// mobile/src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import itemReducer from './itemSlice';

const rootReducer = combineReducers({
  item: itemReducer,
});

export default rootReducer;
