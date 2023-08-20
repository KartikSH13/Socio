import { createSlice } from "@reduxjs/toolkit";
const slice =createSlice({
    name:"userdata",
    initialState:{
        value:{
            isLogin:false,
            name:"",
            token:"",
            userlist:[],
            my_posts:[]
        }
    },
    reducers:{
        setData:(state,action)=>{
            state.value={isLogin:true,name:action.payload.name,token:action.payload.token,userlist:[],my_posts:[]}
        },
        setUserList:(state,action)=>{
            state.value={...state.value,userlist:action.payload}
        },
        setMyPost:(state,action)=>{
            state.value={...state.value,my_posts:action.payload}
        },
        setName:(state,action)=>{
            state.value={...state.value,name:action.payload}
        },
        logOut:(state)=>{
            state.value={isLogin:false,name:"",token:"",userlist:[],my_posts:[]}
        }
    }
})
export const {setData,setUserList,setMyPost,setName,logOut}=slice.actions
export default slice.reducer;