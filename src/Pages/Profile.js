import { onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Posts from "../Components/Post";
import { q } from "../firebase";
import AuthContext from "../store/AuthContext";

const Profile = () => {
  const [imageInput, setImageInput] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [avatar, setAvatar] = useState("");

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [oldPosts, setOldPosts] = useState([]);

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      let posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setOldPosts(posts);
    });
  }, []);

  const logoutHandler = () => {
    authCtx.logout(authCtx.token);
    navigate("/");
  };

  const avatarHandler = (e) => {
    e.preventDefault();

    setImageInput(!imageInput);
  };

  const setAvatarHandler = (e) => {
    e.preventDefault();

    localStorage.setItem(`avatar-${localStorage.getItem("uid")}`, avatar);
  };

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const showPostsHandler = (e) => {
    e.preventDefault();

    setShowLikes(!showLikes);
    setShowPosts(!showPosts);
  };

  const showLikesHandler = (e) => {
    e.preventDefault();

    setShowPosts(!showPosts);
    setShowLikes(!showLikes);
  };

  return (
    <>
      <nav className="w-5/6 py-10 mx-auto background">
        <ul className="flex items-center text-[#E85A4F] justify-between">
          <Link
            to="/"
            className="text-4xl font-extrabold tracking-wide duration-200 hover:scale-110"
          >
            Logo
          </Link>
          <div className="flex items-center gap-10">
            <button
              onClick={logoutHandler}
              className="font-semibold duration-200 hover:scale-110"
            >
              Logout
            </button>
          </div>
        </ul>
      </nav>
      <section className="flex justify-center w-5/6 gap-5 mx-auto">
        <button
          onClick={showPostsHandler}
          className={`w-1/5 px-10 py-3 mt-2 text-2xl font-medium duration-200 border-2 border-[#E85A4F] hover:bg-[#E85A4F] hover:text-white rounded-2xl hover:scale-105 ${
            showPosts ? "bg-[#E85A4F] text-white" : "bg-transparent text-black"
          }`}
        >
          Posts
        </button>
        <button
          onClick={showLikesHandler}
          className={`w-1/5 px-10 py-3 mt-2 text-2xl font-medium duration-200 border-2 border-[#E85A4F] hover:bg-[#E85A4F] hover:text-white rounded-2xl hover:scale-105 ${
            showLikes ? "bg-[#E85A4F] text-white" : "bg-transparent text-black"
          }`}
        >
          Likes
        </button>
      </section>
      {showPosts && (
        <section>
          {oldPosts?.map(
            (post, index) =>
              localStorage.getItem("uid") === post.uid && (
                <Posts
                  key={index}
                  username={post.username}
                  text={post.text}
                  avatar={post.avatar}
                  category={post.category}
                  image={post.image}
                  uuid={post.postUUID}
                  timestamp={post.timestamp
                    ?.toDate()
                    .toLocaleDateString("en-US", options)}
                />
              )
          )}
        </section>
      )}
      {showLikes && (
        <section>
          {oldPosts?.map(
            (post, index) =>
              localStorage.getItem(
                `${localStorage.getItem("uid")}-${post.postUUID}`
              ) && (
                <Posts
                  key={index}
                  username={post.username}
                  text={post.text}
                  avatar={post.avatar}
                  category={post.category}
                  image={post.image}
                  uuid={post.postUUID}
                  timestamp={post.timestamp
                    ?.toDate()
                    .toLocaleDateString("en-US", options)}
                />
              )
          )}
        </section>
      )}
      <button
        className="border-2 border-[#E85A4F] rounded-3xl px-5 py-1 font-normal tracking-wide text-black hover:bg-[#E85A4F] hover:text-white duration-200"
        onClick={avatarHandler}
      >
        Change avatar
      </button>
      {imageInput && (
        <div>
          <input
            onChange={(e) => setAvatar(e.target.value)}
            value={avatar}
            className="w-5/6 pt-2 text-lg text-black bg-red-500"
            name="image"
            placeholder="Upload image URL"
          ></input>
          <button
            className="border-2 border-[#E85A4F] rounded-3xl px-5 py-1 font-normal tracking-wide text-black hover:bg-[#E85A4F] hover:text-white duration-200"
            onClick={setAvatarHandler}
          >
            Confirm avatar
          </button>
        </div>
      )}
    </>
  );
};

export default Profile;
