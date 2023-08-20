import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import { PostRequest } from '../Server/ServerRequests'
import url from '../Server/URL'
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../REDUX/UserSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const email = useRef();
    const pass = useRef();
    const [err, seterror] = useState();
    const [loading, Doloading] = useState(false);
    const isLogin = useSelector(state => state.userdata.value.isLogin)

    const loginUser = async (event) => {
        Doloading(true)
        event.preventDefault()
        try {
            console.log(url.USER_LOGIN)
            var response = await PostRequest(url.USER_LOGIN, { "email": email.current.value, "password": pass.current.value })
            console.log(response)
            response = response.data;
            if (!response.status) {
                seterror(response.message);
            } else {
                const d = new Date();
                d.setTime(d.getTime() + (0.5 * 24 * 60 * 60 * 1000));
                let expires = "Expires=" + d.toUTCString() + " ;";
                document.cookie = "username=" + response.data.name + ";Path=/;" + expires;
                document.cookie = "token=" + response.data.token + ";Path=/;" + expires;
                dispatch(setData(response.data));
                navigate("/SocialChatApplication/home");
            }
        } catch (error) {
            window.alert("Server crash ,"+error);
        }
        Doloading(false)
    }
    const cursorevent = (e) => {
        var cursor = document.querySelector(".cursor");
        var cursor2 = document.querySelector(".cursor2");
        cursor.style.cssText = cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
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
            navigate("/SocialChatApplication/home");
        }
    }
    useEffect(() => {
        if (!isLogin) {
            RenderCookie()
        }
    }, [])
    return <main className="container m-5" >
        <div className="row position-absolute top-50 start-50 translate-middle overflow-visible" style={{ overflow: "visible" }} onMouseMove={cursorevent}>
            {/* Left facebook */}
            <div className="col-lg-6 mx-1 col-md-6 col-sm-12 cursor-content">
                <div className="typewriter text-center text-uppercase">
                    <h1 className="text-light fw-bolder">chatbuddy</h1>
                </div>
                <h4 className="font-weight-light text-light">Chatbuddy helps you connect and share with the people in your life</h4>
            </div>
            {/* Login form */}
            <div className="col-lg-5 col-md-5 col-sm-12 shadow border rounded-3 border-1 p-3 bg-light text-center  cursor-content">
                <form className="form " onSubmit={loginUser}>
                    <div className="input-group input-group-lg my-3 p-1">
                        <input type="email" className="form-control rounded-3" placeholder="Enter your email address" ref={email} onKeyUp={() => seterror(undefined)} />
                    </div>
                    <div className="input-group input-group-lg my-3 p-1">
                        <input type="password" className="form-control rounded-3" placeholder="Password" ref={pass} onKeyUp={() => seterror(undefined)} />
                    </div>

                    {loading ?
                        <button className="input-group input-group-lg my-3 btn btn-lg btn-primary rounded-3 fw-bolder justify-content-center bg-theme" style={{cursor:"wait"}}>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp;
                            Loading....
                        </button> :
                        <button type="submit" className="input-group input-group-lg my-3 btn btn-lg btn-primary rounded-3 fw-bolder justify-content-center bg-theme">
                            Login
                        </button>
                    }
                </form>
                <hr />

                {err != undefined ? <div><h5 className="text-danger">{err}</h5></div> : ""}

                {/* Link to change login component to register component */}
                <Link to={"/SocialChatApplication/register"} className="btn btn-success btn-lg fw-bold mt-2">Create New Account</Link>
            </div>
        </div>
        <div className="cursor"></div>
        <div className="cursor2"></div>
    </main>

}