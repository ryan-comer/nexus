import { configureStore } from '@reduxjs/toolkit'
import botSlice from './features/bots/botslice'

export default configureStore({
  reducer: {
    bot: botSlice,
  },
});