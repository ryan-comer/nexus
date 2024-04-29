import { configureStore } from '@reduxjs/toolkit'
import botSlice from './features/bots/botslice'
import newsSlice from './features/news/feedslice';

export default configureStore({
  reducer: {
    bot: botSlice,
    news: newsSlice
  },
});