import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logOut } from "../../REDUX/UserSlice"
import { useDispatch } from "react-redux"
import { setFrame } from "../../REDUX/FrameSlice"
export default function Header() {
  var userdata = useSelector(state => state.userdata.value) // current user data
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const LogOut = () => {
    document.cookie = "username=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "token=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    dispatch(logOut());
    window.location.reload();
    navigate('/login')
  }

  const changeFrame = (framename, id1, id2) => {
    dispatch(setFrame(framename))
    document.getElementById(id1).classList.add("active")
    document.getElementById(id2).classList.remove("active")
  }
  return <>
    <nav className="navbar navbar-light bg-light navbar-expand-lg fixed-top border-bottom rounded-bottom border-3 ">
      <div className="container-fluid row">
        <Link className="navbar-brand col" to='/SocialChatApplication/home' onClick={() => changeFrame("postframe", "home", "freinds")}>
          <img className="header__logo" width="30" height="30" alt="" />
        </Link>

        <button className="navbar-toggler col" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar" aria-controls="collapsibleNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse col-lg-7 col-md-12 col-sm-12 row" id="collapsibleNavbar">
            <div className="navbar-nav d-flex justify-content-between">
              <li className="nav-item">
                <div className="header__middle my-1" title="Home">
                  <Link to="/SocialChatApplication/home" className="header__option active" onClick={() => changeFrame("postframe", "home", "freinds")} id="home" style={{ "textDecoration": "none" }}>
                    <span className="material-icons" > home </span>
                  </Link>
                  <Link to="/SocialChatApplication/home" className="header__option " onClick={() => changeFrame("freindsframe", "freinds", "home")} id="freinds" title="Freinds" style={{ "textDecoration": "none" }}>
                    <span className="material-icons" > supervised_user_circle </span>
                  </Link>
                </div>
              </li>
              <li className="nav-item d-flex flex-row">
                <Link to="/SocialChatApplication/home/profile" style={{ textDecoration: 'none' }}>
                  <div className="header__info" >
                    <img className="user__avatar" alt=""
                    />
                    <h4 className="fancy-hover pt-1">{userdata.name}</h4>
                  </div>
                </Link>
                <div className="material-symbols-outlined my-2 ps-4" onClick={LogOut} style={{ "cursor": "pointer" }} title="Logout">
                  logout
                </div>
              </li>
            </div>
          </div>
      </div>
    </nav>
  </>
}