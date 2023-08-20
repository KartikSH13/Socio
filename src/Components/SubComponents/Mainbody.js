import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetRequest, ImagePostRequest, SpecialPostRequest } from "../../Server/ServerRequests";
import urls from '../../Server/URL'
import { setPost } from "../../REDUX/PostSlice";
import FreindProfile from "./FreindProfile";
import { setFrame } from "../../REDUX/FrameSlice";
export default function Mainbody() {

    const dispatch = useDispatch();
    /*------------------Redux data------------------------*/
    var posts = useSelector(state => state.postdata.value) // all posts 
    const userdata = useSelector(state => state.userdata.value) //logined user data
    var frame = useSelector(state => state.framedata.value)
    const user_list = userdata.userlist;
    const token = userdata.token
    const userlist = userdata.userlist
    /*------------------Redux data------------------------*/

    var post_id = useRef();
    var [currentFreind, setCurrentFreind] = useState();
    var [previousFrame, setPreviousFrame] = useState();
    const [selectedImage, setSelectedImage] = useState(null);
    const [comment, DoComment] = useState(undefined);
    const post_text = useRef(null);
    const saveComment = async (event) => {
        event.preventDefault();
        if (comment != undefined) {
            const response = await SpecialPostRequest(urls.COMMENT_SAVE, {
                "comment": comment, "post": post_id.current
            }, token)
            DoComment(undefined);
            if (response.data.status) {
                var allPosts = await GetRequest(urls.POST_LIST, token)
                dispatch(setPost(allPosts.data.data.reverse()))
                event.target.reset();
            } else {
                window.alert(response.data.message)
            }
        }
    }
    const create_post = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("message", post_text.current.value);
        if (selectedImage != null) {
            var response = await ImagePostRequest(urls.USER_SAVE_POST, token, formData, true);
            if (response.data.status) {
                image_remove();
                document.getElementById('post-text').innerText = '';
                document.getElementById('post-text').textContent = '';
            } else {
                window.alert('failed');
            }
        }
        else if (post_text.current.value != '') {
            var response = await ImagePostRequest(urls.USER_SAVE_POST, token, {
                "message": post_text.current.value
            }, false);

            if (response.data.status) {
                var allPosts = await GetRequest(urls.POST_LIST, token)
                dispatch(setPost(allPosts.data.data.reverse()))
                event.target.reset();
                image_remove();
                document.getElementById('post-text').textContent = '';
            } else {
                window.alert('failed');
            }
        }
    }
    const setFreind = (object) => {
        setCurrentFreind(object)
        dispatch(setFrame("freindprofileframe"))
    }
    const image_select = (event) => {
        setSelectedImage(event.target.files[0]);
        document.getElementById('upload-label').textContent = event.target.files[0].name;
        window.displayCross();
    }
    const image_remove = () => {
        setSelectedImage(null);
        document.getElementById('upload-label').textContent = " Choose file ";
        window.HideCross();
    }
    const removeFreind = (pf) => {
        dispatch(setFrame(pf))
    }
    useEffect(() => {
        dispatch(setFrame("postframe"))
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [])
    const Loader = () => {
        return <>
            <div className="cssloader">
                <div className="sh1"></div>
                <div className="sh2"></div>
                <h4 className="lt">loading</h4>
            </div>
        </>
    }
    const FreindsTab = () => {
        return <div className="main__body mt-4 p-4">
            <div className="feed">
                {userlist.length != 0 ? userlist.map((ob) => {
                    return <div className="post">
                        <div className="post__top shadow-sm" onClick={() => { setFreind(ob); setPreviousFrame("freindsFrame") }} style={{ "cursor": "pointer" }}>
                            {ob.image != null ? <img className="user_avatar post__avatar border" alt="" src={ob.image} /> : <img className="user__avatar post__avatar shadow" />}
                            <div className="post__topInfo">
                                <h3>{ob.name}</h3>
                                <p>{ }</p>
                            </div>
                        </div>
                    </div>
                }) : <Loader />}
            </div>
        </div >
    }
    return frame == "postframe" ? <div className="main__body mt-4">
        <div className="feed">
            {/* create posts */}
            <div className="messageSender mt-5">
                <div className="text-center">
                    <h1>Add to your <span className="theme-color" style={{ fontFamily: "cursive" }}>Post</span></h1>
                </div>
                <div className="messageSender__top px-3">
                    <form onSubmit={create_post} className="row">
                        <div className="pb-2 col-12 row">
                            <div className="col-lg-5 col-sm-12 col-md-12">
                                <input className="messageSender__input" placeholder="What's on your mind?" id="post-text" ref={post_text} type="text" />
                            </div>
                            <div className="col-lg-5 col-sm-12 col-md-12 input-group rounded-pill shadow-md d-flex flex-row" style={{ backgroundColor: "#eff2f5" }}>
                                <div className="input-group-append">
                                    <input id="upload" accept="image/*" type="file" className="form-control border-0" onChange={image_select} />
                                    <label id="upload-label" htmlFor="upload" className="font-weight-light text-muted overflow-hidden">Choose file</label>
                                </div>
                                <div className="input-group-append mt-3 ms-1" onClick={image_remove} id="image-remove" style={{ display: "none", cursor: "pointer" }}>
                                    <span className="material-symbols-outlined">close</span>
                                </div>
                                <div className="input-group-append">
                                    <label htmlFor="upload" className="btn btn-light mt-2 rounded-pill px-4"> <i className="fa fa-cloud-upload text-muted"></i><small className="text-uppercase font-weight-bold text-muted" >Choose file</small></label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className=" mb-3 p-2 ml-3">
                            <button type="submit" className="btn btn-success rounded-pill">Create post</button>
                        </div>
                    </form>
                </div>
            </div>

            {/*  Dynamic posts */}
            {posts.length != 0 ?
                posts.map((object, index) => {
                    console.log(object.postBy.image)
                    return <div className="post">
                        <div className="post__top shadow-sm" onClick={() => { setFreind(object.postBy); setPreviousFrame("postframe") }} style={{ "cursor": "pointer" }}>
                            {object.postBy.image != null ? <img className="user_avatar post__avatar border" alt="" src={object.postBy.image} /> : <img className="user__avatar post__avatar shadow" />}
                            <div className="post__topInfo">
                                <h3>{object.postBy.name}</h3>
                                <p>{object.postdate.substring(0, object.postdate.lastIndexOf("-") + 3)}</p>
                            </div>
                        </div>

                        <div className="post__bottom">
                            <p>{object.message}</p>
                        </div>
                        <div className="post__image">
                            <img src={object.postfile} alt="" />
                        </div>
                        <div className="post__options" onClick={() => window.displayComment("comments" + object.id)}>
                            <div className="post__option">
                                <span className="material-icons"> chat_bubble_outline </span>
                                <p >Comment</p>
                            </div>
                        </div>
                        <div style={{ display: "none" }} id={"comments" + object.id} >{object.comments.length != 0 ?
                            <ul className="comments_section list-inline border shadow rounded-3" >
                                {object.comments.map(data => {
                                    var comment_user = user_list.filter(ob => ob.id == data.sender)
                                    return <li className="post__top">
                                        {comment_user[0] != undefined ? <>
                                            {comment_user[0].image != null ? <img className="user_avatar post__avatar border" alt="loading" src={comment_user[0].image} /> : <img className="user__avatar post__avatar border" alt="loading" />}
                                            <div className="post__topInfo alert-secondary w-25 " style={{ "borderRadius": "50px" }}>
                                                <h3 className="fw-bold ms-4 mt-2">{comment_user[0].name}</h3>
                                                <p className=" text-dark ms-4">{data.comment}</p>
                                            </div>
                                        </> :
                                            <><img className="user__avatar post__avatar border" alt="loading" />
                                                <div className="post__topInfo alert-secondary w-25 " style={{ "borderRadius": "50px" }}>
                                                    <h3 className="fw-bold ms-4 mt-2">{userdata.name}</h3>
                                                    <p className=" text-dark ms-4">{data.comment}</p>
                                                </div></>
                                        }
                                    </li>
                                })}
                            </ul>
                            : ""}
                            <div className="messageSender">
                                <div className="messageSender__top px-3">
                                    <img className="user__avatar" alt="" />
                                    <form onSubmit={saveComment}>
                                        <input className="messageSender__input" placeholder=" Write a comment ... " type="text" id={"comm" + index} onChange={(event) => { DoComment(event.target.value); post_id.current = object.id; }} />
                                        <button type="submit" className="post_button px-3 py-1 m-1" >Post</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }) : <Loader />}
            {/* <Loader/> */}
        </div>
    </div> : frame == "freindprofileframe" ? <FreindProfile freindData={currentFreind} removeFreind={removeFreind} previousFrame={previousFrame} /> :
        <FreindsTab />
}