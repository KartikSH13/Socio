import { createSlice } from "@reduxjs/toolkit";

const slice=createSlice({
    name:"postdata",
    initialState:{
        value:[]
    }
    ,
    reducers:{
        setPost:(state,action)=>{
            state.value=action.payload
        },
    }

})
export const{setPost}=slice.actions
export default slice.reducer
