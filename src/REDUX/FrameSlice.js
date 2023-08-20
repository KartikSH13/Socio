import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "framedata",
    initialState: {
        value: "postframe"
    },
    reducers: {
        setFrame: (state, action) => {
            state.value = action.payload;
        }
    }
})
export const { setFrame } = slice.actions
export default slice.reducer