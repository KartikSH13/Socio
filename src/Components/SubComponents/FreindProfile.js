import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { GetRequest } from "../../Server/ServerRequests";
import urls from '../../Server/URL'
import { SpecialPostRequest } from "../../Server/ServerRequests";
export default function FreindProfile(props) {
    const userdata = useSelector(state => state.userdata.value)
    const token = userdata.token
    const user_list = userdata.userlist
    const [comment, DoComment] = useState(undefined);
    const [posts, setPosts] = useState([]);
    const [chat, setChat] = useState([]);
    const [tab, setTab] = useState("post-tab");
    var post_id = useRef();
    var Loader = () => {
        console.log("loaded")
        return <>
            <div className="cssloader" id="loader">
                <div className="sh1"></div>
                <div className="sh2"></div>
                <h4 className="lt">loading</h4>
            </div>
        </>
    }
    const saveComment = async (event) => {
        event.preventDefault();
        const response = await SpecialPostRequest(urls.COMMENT_SAVE, {
            "comment": comment, "post": post_id.current
        }, token)
        if (response.data.status) {
            DoComment(undefined);
            loadposts();
            event.target.reset();
        } else {
            window.alert(response.data.message)
        }
    }
    const loadposts = async () => {
        const response = await GetRequest(urls.FREIND_POST + props.freindData.id, token)
        if (response.data.status) {
            if (response.data.data.length == 0) {
                console.log("0 posts");
                var loader = document.getElementById('loader');
                loader.classList.remove("cssloader")
                loader.outerHTML = "<div class='post '><div class='post__bottom text-center'><h3>No Posts Yet</h3></div></div>";
                console.log(loader.innerHTML)
            }
            setPosts(response.data.data.reverse())
        }
        else {
            window.alert("Server request failed" + response.data.message)
        }
    }
    const loadChats = async () => {
        const response = await GetRequest(urls.FREIND_MESSAGE + props.freindData.id, token)
        if (response.data.status) {
            setChat(response.data.data)
        }
        else {
            window.alert("Server request failed :" + response.data.message)
        }
    }
    const switchTabs = (tab1, tab2) => {
        setTab(tab1)
        document.getElementById(tab1).classList.add("active")
        document.getElementById(tab2).classList.remove("active")
    }
    useEffect(() => {
        loadposts();
        loadChats();
    }, [])
    return <>
        <div className="main__body mt-4 ">
            <div className="feed">
                <div className="user__profile border-bottom">
                    {/* Back button  */}
                    <div className="material-symbols-outlined fs-1 position-fixed fw-bolder " style={{ cursor: "pointer", "alignSelf": "start", "top": "100px" }} onClick={() => props.removeFreind(props.previousFrame)}>
                        arrow_back
                    </div>
                    {/* User's personal info */}
                    <div className="user__profile_top border-bottom">
                        {props.freindData.image != null ? <img className="user_avatar_big post__avatar" alt="" src={props.freindData.image} /> : <img className="user__avatar_big post__avatar" />}
                        <h2 className="user__name">{props.freindData.name} <sub className="text-silent fw-lighter">{props.freindData.gender}</sub></h2>
                    </div>
                    <hr />
                    <nav>
                        <div className="header__middle mb-5">
                            <div className="header__option active" id="post-tab" onClick={() => switchTabs("post-tab", "message-tab")}>
                                <span className="material-icons" title="posts"> supervised_user_circle </span>
                            </div>
                            <div className="header__option " id="message-tab" onClick={() => switchTabs("message-tab", "post-tab")}>
                                <span className="material-icons"> chat </span>
                            </div>
                        </div>
                    </nav>
                </div>
                {/* Freind's all Post */}
                {tab == "post-tab" ? posts.length != 0 ? posts.map((object) => {
                    var postdate = String(object.postdate);
                    var image = object.postBy.image
                    var postfile = object.postfile
                    if (postfile != null) {
                        postfile = String(object.postfile)
                        postfile = postfile.substring(0, postfile.indexOf("/")) + "/" + postfile.substring(postfile.indexOf("/"), postfile.length)
                    }
                    postdate = postdate.substring(0, postdate.lastIndexOf("-") + 3)
                    return <div className="post">
                        <div className="post__top" >
                            {image != null ? <img className="user_avatar post__avatar" alt="" src={image} /> : <img className="user__avatar post__avatar" />}
                            <div className="post__topInfo">
                                <h3>{object.postBy.name}</h3>
                                <p>{postdate}</p>
                            </div>
                        </div>

                        <div className="post__bottom">
                            <p>{object.message}</p>
                        </div>
                        <div className="post__image">
                            <img src={postfile} alt="" />
                        </div>
                        <div className="post__options" onClick={() => window.displayComment("Fcomments" + object.id)}>
                            <div className="post__option">
                                <span className="material-icons"> chat_bubble_outline </span>
                                <p >Comment</p>
                            </div>
                        </div>
                        <div style={{ display: "none" }} id={"Fcomments" + object.id}>{object.comments.length != 0 ?
                            <ul className="comments_section list-inline border shadow rounded-3 mx-5">
                                {object.comments.map(data => {
                                    var comment_user = user_list.filter(ob => ob.id == data.sender)
                                    return <li>
                                        <div className="post__top">
                                            {comment_user[0] != undefined ? <>
                                                <img className="user_avatar post__avatar border" alt="loading" src={comment_user[0].image} />
                                                <div className="post__topInfo alert-secondary w-25 " style={{ "borderRadius": "50px" }}>
                                                    <h6 className="fw-bold ms-4 mt-2">{comment_user[0].name}</h6>
                                                    <p className="text-dark ms-4 ">{data.comment}</p>
                                                </div>
                                            </> :
                                                <><img className="user__avatar post__avatar border" alt="loading" />
                                                    <div className="post__topInfo alert-secondary w-25 " style={{ "borderRadius": "50px" }}>
                                                        <h3 className="fw-bold ms-4 mt-2">{userdata.name}</h3>
                                                        <p className=" text-dark ms-4">{data.comment}</p>
                                                    </div></>
                                            }
                                        </div>
                                    </li>
                                })}
                            </ul>
                            : ""}
                            <div className="messageSender">
                                <div className="messageSender__top">
                                    {image != null ? <img className="user_avatar post__avatar" alt="" src={image} /> : <img className="user__avatar post__avatar" />}
                                    <form onSubmit={saveComment}>
                                        <input className="messageSender__input" onChange={(event) => { DoComment(event.target.value); post_id.current = object.id }} placeholder=" Write a comment ... " />
                                        <button type="submit" className="post_button px-3 py-1 m-1">Post</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }) : <><div className="cssloader" id="loader">
                    <div className="sh1"></div>
                    <div className="sh2"></div>
                    <h4 className="lt">loading</h4>
                </div> </>: <div className="bg-light w-100 border rounded-3 mt-5 ">
                    <ul className="list-inline bg-light">
                        {chat.length != 0 ? chat.map(ob => {
                            const currUser = user_list.filter(object => object.id == ob.sender)
                            return <li className="comments_section post__top">
                                {currUser[0] != undefined ? <>
                                    <img className="user_avatar post__avatar border" alt="loading" src={currUser[0].image} />
                                    <div className="post__topInfo alert-secondary w-25 " style={{ "borderRadius": "50px" }}>
                                        <h6 className="fw-bold ms-4 mt-2">{currUser[0].name}</h6>
                                        <p className="text-dark ms-4 ">{ob.msg}</p>
                                    </div>
                                </> :
                                    <><img className="user__avatar post__avatar border" alt="loading" />
                                        <div className="post__topInfo alert-secondary w-25 " style={{ "borderRadius": "50px" }}>
                                            <p className=" text-dark ms-4">{ob.msg}</p>
                                        </div></>
                                }
                            </li>
                        }) : ""
                        }
                    </ul>
                </div>}

            </div>
        </div>
    </>
}
