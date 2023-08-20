import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserList, setMyPost, logOut } from "../REDUX/UserSlice";
import { setPost } from '../REDUX/PostSlice'
import urls from '../Server/URL'
import { useSelector } from "react-redux";
import { GetRequest } from "../Server/ServerRequests";
import Header from "./SubComponents/Header";
import Mainbody from './SubComponents/Mainbody'
import { useNavigate } from "react-router-dom";
export default function Home() {
    
    const dispatch = useDispatch();
    const navigate=useNavigate();

    var userdata = useSelector(state => state.userdata.value) // current user data

    const load = async () => {
        //requesting server to respond with all user's list {server will respond with all user excpet current user}
        var userlist_response = await GetRequest(urls.USER_LIST, userdata.token);
        // dispatching all user's list to redux 
        dispatch(setUserList(userlist_response.data.data))
        
        // requesting server to respond with all posts(other than users's self posts)
        var allPosts = await GetRequest(urls.POST_LIST, userdata.token)

        // if token is expired than deleting the cookie and redirecting user to login page
        if (allPosts.data.message == "Invalid or Expire Token !"){
            document.cookie = "username=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "token=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            dispatch(logOut());
            navigate('/SocialChatApplication/login');
        }
        //else dispatching all posts to redux 
        else{
            dispatch(setPost(allPosts.data.data.reverse()))
        }

        // reqesting server to respond with user's all post 
        var userPosts = await GetRequest(urls.MY_POST, userdata.token)
        // dispatching all user's post to redux , reverse() is used to reverse the user's posts from newest to oldest
        dispatch(setMyPost(userPosts.data.data.reverse()))
    }

    // to fetch data when component is rendered ( run only first time when component will mount )
    // useEffect(() => {
    //     load();
    // }, [])

    return <>
        <Header />
        <Mainbody />
    </>
}