// store.ts
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { combineReducers } from 'redux'
import authSlice from './authSlice.js'
import postSlice from './postSlice.js'

// persist config
const persistConfig = {
  key: 'root',
  storage,
}

// combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  post:postSlice,
})

// persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// create store
export const store = configureStore({
  reducer: persistedReducer,
})


export default store
