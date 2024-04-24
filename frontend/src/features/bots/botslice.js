import { createSlice } from "@reduxjs/toolkit";

export const botSlice = createSlice({
    name: "bot",
    initialState: {
        bots: []
    },
    reducers: {
        setBots: (state, action) => {
            state.bots = [...action.payload];
        }
    }
});

export const { setBots } = botSlice.actions;

export default botSlice.reducer;