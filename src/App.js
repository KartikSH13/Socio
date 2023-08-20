import './App.css';
import Login from './Components/Login';
import { Route, Routes } from 'react-router-dom';
import Register from './Components/Register';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import urls from './Server/URL'
import { GetRequest } from './Server/ServerRequests';
import { setUserList, setMyPost } from './REDUX/UserSlice';
import { setPost } from './REDUX/PostSlice';
import { useSelector } from 'react-redux';
import { setData,logOut } from './REDUX/UserSlice';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var userdata = useSelector(state => state.userdata.value) // current user data
  const isLogin = useSelector(state => state.userdata.value.isLogin)

  const load = async () => {
    //requesting server to respond with all user's list {server will respond with all user excpet current user}
    var userlist_response = await GetRequest(urls.USER_LIST, userdata.token);

    // if token is expired than deleting the cookie and redirecting user to login page
    if (userlist_response.data.message == "Invalid or Expire Token !") {
      document.cookie = "username=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "token=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      dispatch(logOut());
      navigate('/SocialChatApplication/login');
    }
    //else dispatching all user's list to redux 
    else {
      dispatch(setUserList(userlist_response.data.data))
    }

    // requesting server to respond with all posts(other than users's self posts)
    var allPosts = await GetRequest(urls.POST_LIST, userdata.token)
    dispatch(setPost(allPosts.data.data.reverse()))

    // reqesting server to respond with user's all post 
    var userPosts = await GetRequest(urls.MY_POST, userdata.token)
    // dispatching all user's post to redux , reverse() is used to reverse the user's posts from newest to oldest
    dispatch(setMyPost(userPosts.data.data.reverse()))
  }
  const RenderCookie = () => {
    let cookie = document.cookie;
    if (cookie.length != 0) {
      cookie = cookie.split(";");
      const username = cookie[0].split("=");
      const token = cookie[1].split("=");
      const data = {
        "name": username[1],
        "token": token[1]
      }
      dispatch(setData(data));
    }
    else {
      navigate("/SocialChatApplication/login")
    }
  }
  useEffect(() => {
    if (isLogin) {
      load();
    }
  }, [isLogin])

  useEffect(() => {
    if (!isLogin) {
      RenderCookie()
    }
  }, []);

  return <>
    <Routes>
      <Route path='/SocialChatApplication/' element={<Home />}></Route>
      <Route path='/SocialChatApplication/login' element={<Login />}></Route>
      <Route path='/SocialChatApplication/register' element={<Register />}></Route>
      <Route path='/SocialChatApplication/home' element={<Home />}></Route>
      <Route path='/SocialChatApplication/home/profile' element={<UserProfile />}></Route>
    </Routes>
    </>
}
export default App;