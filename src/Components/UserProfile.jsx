import Header from "./SubComponents/Header";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { PutRequest, SpecialPutRequest, SpecialPostRequest, GetRequest } from "../Server/ServerRequests";
import url from '../Server/URL';
import { setMyPost, setName } from "../REDUX/UserSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function UserProfile() {
    const userdata = useSelector(state => state.userdata.value) // Logined user data
    const token = userdata.token
    const posts = useSelector(state => state.userdata.value.my_posts) // Logined user's all Post
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useRef();
    const phone = useRef();
    const oldPass = useRef();
    const newPass = useRef();
    const post_id = useRef()
    const image = null;
    const [selectedImage, setSelectedImage] = useState(null);
    const [err, seterror] = useState();
    const [comment, DoComment] = useState(undefined);

    const saveComment = async (event) => {
        event.preventDefault();
        if (comment != undefined) {
            const response = await SpecialPostRequest(url.COMMENT_SAVE, {
                "comment": comment, "post": post_id.current
            }, token)
            DoComment(undefined);
            if (response.data.status) {
                var allPosts = await GetRequest(url.MY_POST, token)
                dispatch(setMyPost(allPosts.data.data))
                event.target.reset();
            } else {
                window.alert(response.data.message)
            }
        }

    }
    const UpdateInfo = async (event) => {
        event.preventDefault();
        var response = await PutRequest(url.USER_UPDATE, userdata.token, { "name": name.current.value, "phone": phone.current.value })
        if (response.data.status) {
            dispatch(setName(response.data.data.name))
            window.SuccessToast("Info updated successfully")
            window.InfoToggle()
            event.target.reset();
        }
        else {
            window.ErrorToast("Failed updating user info")
        }
    }
    const UploadImage = async (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append("image", selectedImage);
        var response = await SpecialPutRequest(url.USER_UPLOAD_PIC, userdata.token, formData)
        if (response.data.status) {
            window.SuccessToast("Image uploaded successfully")
            window.ImageToggle()
            event.target.reset();
            setSelectedImage(null);
            document.getElementById('upload-label').textContent = "Choose file";
            window.HideCross();
        }
        else {
            window.ErrorToast(response.data.message)
        }
    }
    const image_select = (event) => {
        setSelectedImage(event.target.files[0]);
        document.getElementById('upload-label').textContent = event.target.files[0].name;
        window.displayCross();
    }

    const image_remove = () => {
        setSelectedImage(null);
        document.getElementById('upload-label').textContent = "Choose file";
        window.HideCross();
    }

    const UpdatePass = async (event) => {
        event.preventDefault()
        var response = await PutRequest(url.USER_CHANGE_PASS, userdata.token, {
            "old_password": oldPass.current.value, "new_password": newPass.current.value
        })
        if (response.data.status) {
            window.SuccessToast("Password updated successfully")
            window.PasswordToggle();
        }
        else {
            window.ErrorToast("Old password does'nt match")
        }
    }
    const back = () => {
        navigate("/SocialChatApplication/home")
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [])
    return (<>
        <Header />
        {/* Success notification  */}
        <div className="toast bg-success text-light position-absolute end-0 m-5" id="toast-success" data-autohide="false">
            <div className="toast-body" id="toast-success-body">
            </div>
        </div>
        {/* Error notification  */}
        <div className="toast bg-danger text-light position-absolute end-0 m-5" id="toast-error" data-autohide="false">
            <div className="toast-body" id="toast-error-body"></div>
        </div>
        {/* main body */}
        <div className="main__body mt-4">
            <div className="feed">
                <div className="user__profile">
                    {/* Back button  */}
                    <div className="material-symbols-outlined fs-1 position-fixed fw-bolder " style={{ cursor: "pointer", "alignSelf": "start", "top": "100px" }} onClick={back}>
                        arrow_back
                    </div>
                    {/* User's personal info */}
                    <div className="user__profile_top">
                        {image != null ? <img className="user_image" alt="" src={image} /> : <img className="user__image" alt="" />}
                        <h2 className="user__name">{userdata.name}</h2>
                        <div className="d-flex flex-row justify-content-between">
                            <button className=" btn btn-outline-success mx-2" onClick={() => window.InfoToggle()}>Update</button>
                            <button className=" btn btn-outline-success mx-2" onClick={() => window.ImageToggle()}>Upload image </button>
                            <button className=" btn btn-outline-success mx-2" onClick={() => window.PasswordToggle()}>Change password</button>
                        </div>
                    </div>
                    <hr />
                    {/* Form to Update name and phone */}
                    <div className="user__profile_bottom" style={{ display: "none" }} id="update_panel">
                        <h3 className="theme-color ">Update your personal info </h3>
                        <form className="row g-3 p-5" onSubmit={UpdateInfo}>
                            <div className="col-auto">
                                <input type="text" className="form-control rounded-3" placeholder="New Name" ref={name} />
                            </div>
                            <div className="col-auto">
                                <input type="text" className="form-control rounded-3" placeholder="New Phone number" ref={phone} />
                            </div>
                            <div className="col-auto">
                                <button type="submit" className="input-group input-group-lg btn btn-primary rounded-3 bg-theme">Update info</button>
                            </div>
                        </form>
                    </div>
                    {/*  Form to upload image (image form)*/}
                    <div className="user__profile_bottom" style={{ display: "none" }} id="image_panel">
                        <form onSubmit={UploadImage} className="row g-3 p-5">
                            <div className="col input-group p-2 rounded-pill shadow-sm" style={{ backgroundColor: "#eff2e0" }}>
                                <div className="input-group-append">
                                    <input id="upload" accept="image/*" type="file" className="form-control border-0" onChange={image_select} />
                                    <label id="upload-label" htmlFor="upload" className="font-weight-light text-muted overflow-hidden">Choose file</label>
                                </div>
                                <div className="input-group-append mt-2 mx-1" onClick={image_remove} id="image-remove" style={{ display: "none", cursor: "pointer" }}>
                                    <span className="material-symbols-outlined">close</span>
                                </div>
                                <div className="input-group-append">
                                    <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"> <i className="fa fa-cloud-upload mr-2 text-muted"></i><small className="text-uppercase font-weight-bold text-muted" >Choose file</small></label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <button type="submit" className="input-group  input-group-lg  p-2 mt-2 btn  btn-primary rounded-pill bg-theme">Update info</button>
                            </div>
                        </form>
                    </div>
                    {/* Form to Change your password  */}
                    <div className="user__profile_bottom" style={{ display: "none" }} id="password_panel">
                        <form onSubmit={UpdatePass} className="row g-3 p-5">
                            <div className="col-auto">
                                <input type="text" className="form-control rounded-3" placeholder="Old password" ref={oldPass} required onKeyUp={() => seterror(undefined)} />
                            </div>
                            <div className="col-auto">
                                <input type="text" className="form-control rounded-3" placeholder="New password" ref={newPass} required />
                            </div>
                            <div className="col-auto">
                                <button type="submit" className="input-group input-group-lg  btn btn-primary  rounded-3 bg-theme">Update</button>
                            </div>
                        </form>
                        {err != undefined ? <div><h4 className="text-danger">{err}</h4></div> : ""}
                    </div>
                </div>
                {/* Logined user's all Post */}
                {posts.length != 0 ? posts.map((object) => {
                    var postdate = String(object.postdate)
                    postdate = postdate.substring(0, postdate.lastIndexOf("-") + 3)
                    return <div className="post">
                        <div className="post__top">
                            <img className="user__avatar post__avatar" alt="" />
                            <div className="post__topInfo">
                                <h3>{userdata.name}</h3>
                                <p>{postdate}</p>
                            </div>
                        </div>

                        <div className="post__bottom">
                            <p>{object.message}</p>
                        </div>

                        <div className="post__image">
                            <img
                                src={object.postfile}
                                alt=""
                            />
                        </div>

                        <div className="post__options" onClick={() => window.displayComment("comments" + object.id)}>
                            <div className="post__option">
                                <span className="material-icons"> chat_bubble_outline </span>
                                <p >Comment</p>
                            </div>
                        </div>
                        <div style={{ display: "none" }} id={"comments" + object.id}>{object.comments.length != 0 ?
                            <ul className="comments_section">
                                {object.comments.map(data => {
                                    return <li><div className="post__top">
                                        {/* <img className="user__avatar post__avatar" alt="loading" src={object.postBy.image} /> */}
                                        <div className="post__topInfo">
                                            <h3>{data.comment}</h3>
                                            <p>{postdate}</p>
                                        </div>
                                    </div></li>
                                })}
                            </ul>
                            : ""}
                            <div className="messageSender">
                                <div className="messageSender__top">
                                    <img className="user__avatar" alt="" />
                                    <form onSubmit={saveComment}>
                                        <input className="messageSender__input" placeholder=" Write a comment ... " type="text"
                                            onChange={(event) => DoComment(event.target.value)} />
                                        <button type="submit" className="post_button px-3 py-1 m-1" onClick={() => post_id.current = object.id}>Post</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }) : ""}
            </div>
        </div>
    </>)
}