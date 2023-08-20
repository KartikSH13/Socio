import { configureStore } from "@reduxjs/toolkit";
import userdata from './UserSlice'
import postdata from './PostSlice'
import framedata from './FrameSlice'
const store=configureStore({
    reducer:{
        userdata:userdata,
        postdata:postdata,
        framedata:framedata
    }
})
export default store