import { createSlice } from "@reduxjs/toolkit";

export const newsSlice = createSlice({
    name: "news",
    initialState: {
        feed: []
    },
    reducers: {
        setFeed: (state, action) => {
            state.feed = [...action.payload];
        }
    }
});

export const { setFeed } = newsSlice.actions;

export default newsSlice.reducer;