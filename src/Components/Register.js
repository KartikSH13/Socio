import { useRef,useState } from "react"
import { Link } from "react-router-dom";
import { PostRequest } from '../Server/ServerRequests'
import url from '../Server/URL'
import { useNavigate } from "react-router-dom";
export default function Login() {
    let navigate = useNavigate();
    const email = useRef(), pass = useRef(), name = useRef(), gender = useRef(), phone = useRef(), err = useRef();
    const [loading, Doloading] = useState(false);

    //Function to change value of gender on key press
    const genderSelct = (e) => gender.current = e.target.value;

    const registerUser = async (event) => {
        Doloading(true);
        event.preventDefault()
        try {
            var ob = {   // initializing user's data object 
                "name": name.current.value, "phone": phone.current.value,
                "email": email.current.value, "password": pass.current.value,
                "gender": gender.current
            }
            var response = await PostRequest(url.USER_REGISTER, ob) // fetch the server response 
            response = response.data;
            if (!response.status)  // if response is failed , set the error
            {
                err.current = response.data[0].message;
            } else  // if response is successfull , redirecting to login page
            {
                window.location.reload();
            }
        } catch (error) {
            window.alert(error)
        }
        Doloading(false)
    }
    return <main className="container m-5">
        <div className="row position-absolute top-50 start-50 translate-middle">
            {/* Left facebook */}
            <div className="col-lg-6 col-md-12 col-sm-12">
                <h1 className="text-light " style={{ fontSize: "3em" }}> Welcome to </h1>
                <h1 className="text-light " style={{ fontSize: "3em" }}> chatbuddy</h1>
                <h4 className="text-light fw-light">Chatbuddy helps you connect and share with the people in your life</h4>
            </div>
            {/* Login form */}
            <div className="col-lg-5 col-md-12 col-sm-12 shadow border rounded-3 border-1 p-3 text-center bg-light">
                <form className="form " onSubmit={registerUser}>
                    <div className="input-group input-group-lg my-2 p-1">
                        <input type="text" className="form-control rounded-3" placeholder="Enter your Name" ref={name} />
                    </div>
                    <div className="input-group input-group-lg my-2 p-1">
                        <input type="email" className="form-control rounded-3" placeholder="Enter your email address" ref={email} />
                    </div>
                    <div className="input-group input-group-lg my-2 p-1">
                        <input type="number" className="form-control rounded-3" placeholder="Phone" ref={phone} />
                    </div>
                    <div className="input-group input-group-lg my-2 p-1">
                        <input type="password" className="form-control rounded-3" placeholder="Password" ref={pass} />
                    </div>
                    <div className="row px-5">
                        <div className="col-auto">
                            <input className="form-check-input" type="radio" name="genderRadio" id="Male" value="Male" onChange={genderSelct} />
                            <label className="form-check-label " for="Male">
                                Male
                            </label>
                        </div>

                        <div className="col-auto">
                            <input className="form-check-input" type="radio" name="genderRadio" id="Female" value="Female" onChange={genderSelct} />
                            <label className="form-check-label " for="Female">
                                Female
                            </label>
                        </div>
                        <div className="col-auto">
                            <input className="form-check-input" type="radio" name="genderRadio" id="Other" value="Other" onChange={(genderSelct)} />
                            <label className="form-check-label " for="Other">
                                Other
                            </label>
                        </div>
                    </div>
                    {loading ?
                        <button className="input-group input-group-lg my-3 btn btn-primary btn-lg rounded-3 fw-bolder justify-content-center"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{cursor:"wait"}}></span>
                            Registrering..
                        </button> :
                        <button type="submit" className="input-group input-group-lg my-3 btn btn-primary btn-lg rounded-3 fw-bolder justify-content-center">Register</button>
                    }
                </form>
                <hr />
                {/* If there is error during registering, display error */}
                {err.current != undefined ? <div><h4 className="text-danger">{err.current}</h4></div> : ""}
                {/* Link to change Register component to login component */}
                <Link to="/SocialChatApplication/login" className="btn btn-success btn-lg fw-bold   input-group input-group-lg justify-content-center">Login</Link>
            </div>

        </div>
    </main>

}