import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../Config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { IoShareOutline } from "react-icons/io5";
import {
  AiOutlineRetweet,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineLink,
} from "react-icons/ai";
import { FiMoreHorizontal, FiBookmark } from "react-icons/fi";
import { BiArrowBack } from "react-icons/bi";
import { RiChat1Line } from "react-icons/ri";
import LoadingScreen from "./LoadingScreen";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { fullDate } from "../Service/Service";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Four04 from "../errorPage/Four04";
import { MdVerified } from "react-icons/md"
import HeaderAlt from "./HeaderAlt";
import PostNotFound from "../errorPage/PostNotFound";
import { Helmet } from "react-helmet";
import { supabase } from "../supabaseClient";
const TweetPage = () => {
  const tweetId = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const tweetRef = doc(db, "tweets", tweetId.id);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState();
  const [tweetData, setTweetData] = useState();
  const [userData, setUserData] = useState();
  const [userLiked, setUserLiked] = useState([]);
  const [userRetweets, setUserRetweets] = useState([]);
  const [userBookmark, setUserBookmark] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [retweets, setRetweets] = useState([]);
  const [changeTitle, setChangeTitle] = useState(false);
  const [bookmark, setBookmark] = useState([]);
  const [reply, setReply] = useState();
  const [error, setError] = useState(false);
  const [Vtype, setVtype] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCurrentUserId(currentUser.uid);
      fetchUserRecord(currentUser.uid);
    });
  }, [user]);
  useEffect(() => {
    if (changeTitle === true) {
      if (!error) {
        document.title = `${tweetData.author_name} (@${tweetData.author_username}) on TweetX: "${tweetData.text}"`
      }
      else {
        document.title = "Error 404 / Post Not Found"
      }
    }
  }, [changeTitle])
  useEffect(() => {
    async function getTweetById() {
      try {
        const { data, error } = await supabase.from("posts").select("*").eq("id", tweetId.id).maybeSingle()
        if (error) throw error
        if (data !== null) {
          setTweetData(data)
          setLoading(false)
          setChangeTitle(true)
        }
      } catch (e) {
        setError(true);
        console.error(e);
      }
    }
    getTweetById();
  }, []);
  async function fetchUserRecord(uid) {
    try {
      const querySnapshot = await getDoc(doc(db, "userData", uid));
      setUserData(querySnapshot.data());
      assureUserVerificationType(querySnapshot.data())
    } catch (e) {
      console.log(e);
    }
  }
  const assureUserVerificationType = (data) => {
    if (data.isVerified === true) {
      setVtype("user")
    }
    else if (data.isDev === true) {
      setVtype("dev")
    }
    else if (data.isCompany === true) {
      setVtype("company")
    }
  }

  useEffect(() => {
    async function fetchComments() {
      if (tweetData) {
        setComments(tweetData.comments);
      }
    }
    fetchComments();
    async function fetchRetweets() {
      if (tweetData) {
        setRetweets(tweetData.users_who_retweeted);
      }
    }
    fetchRetweets();
    async function fetchBm() {
      if (tweetData) {
        setBookmark(tweetData.users_who_bookmarked);
      }
    }
    fetchBm();
    async function fetchLikes() {
      if (tweetData) {
        setLikes(tweetData.users_who_liked);
      }
    }
    fetchLikes();
    async function fetchUserLikes() {
      if (userData) {
        setUserLiked(userData.likes);
      }
    }
    fetchUserLikes();
    async function fetchUserRt() {
      if (userData) {
        setUserRetweets(userData.retweets);
      }
    }
    fetchUserRt();
    async function fetchUserBookmark() {
      if (userData) {
        setUserBookmark(userData.bookmarks);
      }
    }
    fetchUserBookmark();
  }, [tweetData]);

  const handleReply = async () => {
    if (!reply || reply.trim() === "") {
      alert("Invalid Comment, HINT: Comment cannot be empty");
      return;
    }
    // const userName = user.displayName.replace(" ", "_").toLowerCase();
    const linkIndex = reply.indexOf(",");
    const link = reply.substring(0, linkIndex).trim();
    const text = reply.substring(linkIndex + 1).trim();
    if (link, text !== "") {
      const userReply = {
        author_av: user.photoURL,
        author_name: user.displayName,
        author_username: userData.userName,
        comment: text,
        image: link,
        date: fullDate,
        key: uuidv4(),
        verificationType: Vtype,
      };
      const updatedComments = [...comments, userReply];
      await supabase.from("posts").update({
        comments: updatedComments,
      }).eq("id", tweetId.id)
      // window.location.reload();
      setComments(updatedComments);
      setReply(""); // Clear the input field by setting it to an empty string
    } else {
      alert("Comment cannot be empty");
    }
  };
  const handleLikes = async () => {
    // AUTHOR RECORDS
    let newArr;
    const index = likes.indexOf(currentUserId);
    if (index !== -1) {
      newArr = likes.slice();
      newArr.splice(index, 1);
    } else {
      newArr = [...likes, currentUserId];
    }
    await updateDoc(tweetRef, {
      users_who_liked: newArr,
    });
    // USER RECORDS
    let newUserArr;
    const userIndex = userLiked.indexOf(tweetId.id);
    if (userIndex !== -1) {
      newUserArr = userLiked.slice();
      newUserArr.splice(index, 1);
    } else {
      newUserArr = [...userLiked, tweetId.id];
    }
    await updateDoc(doc(db, "userData", user.uid), {
      likes: newUserArr,
    });
    setLikes(newArr);
  };
  const handleRetweets = async () => {
    // AUTHOR RECORD
    let newArr;
    const index = retweets.indexOf(currentUserId);
    if (index !== -1) {
      newArr = retweets.slice();
      newArr.splice(index, 1);
    } else {
      newArr = [...retweets, currentUserId];
    }
    await updateDoc(tweetRef, {
      users_who_retweeted: newArr,
    });
    //USER RECORD
    let newUserArr;
    const userIndex = userRetweets.indexOf(tweetId.id);
    if (userIndex !== -1) {
      newUserArr = userRetweets.slice();
      newUserArr.splice(index, 1);
    } else {
      newUserArr = [...userRetweets, tweetId.id];
    }
    await updateDoc(doc(db, "userData", user.uid), {
      retweets: newUserArr,
    });
    // window.location.reload();
    setRetweets(newArr);
  };
  const handleBookmarks = async () => {
    // AUTHOR RECORD
    let newArr;
    const index = bookmark.indexOf(currentUserId);
    if (index !== -1) {
      newArr = bookmark.slice();
      newArr.splice(index, 1);
    } else {
      newArr = [...bookmark, currentUserId];
    }
    await updateDoc(tweetRef, {
      users_who_bookmarked: newArr,
    });
    //USER RECORD
    let newUserArr;
    const userIndex = userBookmark.indexOf(tweetId.id);
    if (userIndex !== -1) {
      newUserArr = userBookmark.slice();
      newUserArr.splice(index, 1);
    } else {
      newUserArr = [...userBookmark, tweetId.id];
    }
    await updateDoc(doc(db, "userData", user.uid), {
      bookmarks: newUserArr,
    });
    // window.location.reload();
    setBookmark(newArr);
  };
  const copyToClipboard = () => {
    if (tweetData) {
      const currentUrl = `https://tweetx-kappa.vercel.app/post/${tweetId.id}`;
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => alert("URL copied to clipboard!"))
        .catch((err) => console.error("Failed to copy URL to clipboard:", err));
    }
  };
  if (error) return <PostNotFound />;
  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet>
        <title>
          {`${tweetData.author_name} on TweetX: "${tweetData.text}"`}
        </title>
        <meta name="description" content={tweetData.text} />
        {/* OG Tags */}
        <meta property="og:title" content={tweetData.text} />
        <meta property="og:description" content={tweetData.text} />
        <meta property="og:image" content={tweetData.image} />
        <meta property="og:image:alt" content={tweetData.text} /> //TODO: ENFORCE IMAGE ALT ON BACKEND + FRONTEND SIDE 
        {/* Add more OG tags as needed */}
      </Helmet>
      <HeaderAlt page={"Post"} />
      <div className="h-max max-h-max overflow-auto w-full">
        {/* <button
          onClick={() => navigate("/")}
          className="ml-2 mt-[15px] text-lg mb-[-20px] absolute top-0"
        >
          <BiArrowBack />
        </button> */}

        <div className="flex flex-col py-6 px-2 border-gray-800 border-b">
          <div className="flex flex-row justify-between items-center mb-2">
            <div className="flex flex-row items-center">
              <div className="w-[45px] h-full">
                <img
                  src={tweetData.author_av}
                  className="rounded-full h-11 w-11 mt-[-7px]"
                  alt="user_profile_photo"
                />
              </div>
              <div className="flex flex-row justify-between mt-[-8px] text-xs">
                <div className="w-max flex flex-row">
                  <div
                    className="flex flex-col ml-1"
                    onClick={() =>
                      navigate(`/tweetx/user/${tweetData.author_username}`)
                    }
                  >
                    <p className="mr-2 font-semibold text-white tracking-wide flex flex-row">
                      {tweetData.author_name}
                      {tweetData?.verificationType === "user" ? <MdVerified className="text-[15px] ml-1 text-blue-500" title="Verified User Of Tweetx" /> : null}
                      {tweetData?.verificationType === "dev" ? <MdVerified className="text-[15px] ml-1 text-yellow-500" title="Verified Developer Of Tweetx" /> : null}
                      {tweetData?.verificationType === "company" ? <MdVerified className="text-[15px] ml-1 text-yellow-500" title="Official Account Of Tweetx" /> : null}
                    </p>
                    <p className="mr-2 font-semibold text-gray-500">
                      @{tweetData.author_username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button>
                <FiMoreHorizontal />
              </button>
            </div>
          </div>
          <div className="w-full h-max flex flex-col px-1">
            <div className="text-sm max-w-20">
              <p className="max-w-20 mb-2">{tweetData.text}</p>
              {tweetData?.image ? (
                <>
                  <div className="w-full flex flex-row justify-center">
                    <img
                      src={tweetData.image}
                      className="h-max max-h-[420px] mt-px w-max-c rounded-xl ml-[-1px]"
                      alt="tweet_photo"
                    />
                  </div>
                </>
              ) : null}
            </div>
            <div className="px-0 mt-3">
              <div className="border-b border-gray-800 flex flex-row">
                <p className="text-sm text-gray-500 pb-2">
                  {tweetData.time} · {tweetData.date} · {tweetData.specie} from{" "}
                  {tweetData.planet}
                </p>
              </div>
              <div className="border-b border-gray-800 flex flex-row">
                <p className="text-sm text-gray-500 pb-2 mt-1">
                  <span className="text-white">{likes?.length}</span>{" "}
                  {likes?.length <= 1 ? "Like" : "Likes"}
                </p>
                <p className="text-sm text-gray-500 pb-2 mt-1 ml-2">
                  <span className="text-white">{comments?.length}</span>{" "}
                  {comments?.length <= 1 ? "Comment" : "Comments"}
                </p>
              </div>
              <div className="border-b border-gray-800 flex flex-row">
                <p className="text-sm text-gray-500 pb-2 mt-1">
                  <span className="text-white">{retweets?.length}</span>{" "}
                  {retweets?.length <= 1 ? "Repost" : "Reposts"}
                </p>
                <p className="text-sm text-gray-500 pb-2 mt-1 ml-2">
                  <span className="text-white">{bookmark?.length}</span>{" "}
                  {bookmark?.length <= 1 ? "Bookmark" : "Bookmarks"}
                </p>
              </div>
            </div>
            <div className="mt-3 text-lg text-gray-300 flex flex-row justify-between px-5 mb-[-7px]">
              <button className="mr-8">
                {likes?.includes(currentUserId) ? (
                  <AiFillHeart className="text-red-500" onClick={handleLikes} />
                ) : (
                  <AiOutlineHeart onClick={handleLikes} />
                )}
              </button>
              <button className="mr-8">
                {retweets?.includes(currentUserId) ? (
                  <AiOutlineRetweet
                    className="text-green-400"
                    onClick={handleRetweets}
                  />
                ) : (
                  <AiOutlineRetweet onClick={handleRetweets} />
                )}
              </button>
              <button className="mr-8">
                <RiChat1Line
                  onClick={() => {
                    inputRef.current.focus();
                  }}
                />
              </button>
              <button className="mr-8 text-[16px]">
                {bookmark?.includes(currentUserId) ? (
                  <FaBookmark
                    className="text-blue-400"
                    onClick={handleBookmarks}
                  />
                ) : (
                  <FaRegBookmark onClick={handleBookmarks} />
                )}
              </button>
              <button className="mr-8 text-[19px]">
                <AiOutlineLink onClick={() => copyToClipboard()} />
              </button>
            </div>
          </div>
        </div>
        <div className=" py-4 border-b border-gray-800 flex flex-row w-full px-2 bg-gray-900">
          <input
            type="text"
            className="w-full outline-none borer border-gray-800 bg-gray-800 rounded-full px-2 py-1 text-xs mx-2"
            placeholder="Tweet your reply"
            onChange={(e) => setReply(e.target.value)}
            value={reply}
            ref={inputRef}
          />
          <button
            className="px-4 py-[6px] rounded-full text-white text-xs bg-blue-600 font-semibold tracking-wide"
            onClick={() => handleReply()}
          >
            Reply
          </button>
        </div>
        <div className="mb-[44px]">
          {/* <h1 className="text-lg mt-4 ml-2">Comments</h1> */}
          {comments?.map((tweet) => {
            return (
              <>
                <div className="h-max w-full max-h-max overflow-hidden">
                  <div className="flex flex-row py-6 px-2 border-gray-800 border-b">
                    <div className="w-[40px] min-w-[35px] h-full">
                      <img
                        src={tweet.author_av}
                        onClick={() => navigate(`/tweetx/user/${tweet.author_username}`)}
                        className="rounded-3xl h-8 w-8 mt-[-6px]"
                        alt="user_profile_photo"
                      />
                    </div>
                    <div className="w-full h-max flex flex-col px-1">
                      <div className="flex flex-row justify-between mt-[-8px] text-xs">
                        <div className="w-max flex flex-row">
                          <p className="mr-1 font-semibold tracking-wide flex flex-row items-center" onClick={() => navigate(`/tweetx/user/${tweet.author_username}`)}>
                            {tweet.author_name}
                            {tweet?.verificationType === "user" ? <MdVerified className="text-[13px] ml-1 text-blue-500" title="Verified User Of Tweetx" /> : null}
                            {tweet?.verificationType === "dev" ? <MdVerified className="text-[13px] ml-1 text-yellow-500" title="Verified Developer Of Tweetx" /> : null}
                            {tweet?.verificationType === "company" ? <MdVerified className="text-[13px] ml-1 text-yellow-500" title="Official Account Of Tweetx" /> : null}
                          </p>
                          <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide truncate max-w-[80px]" onClick={() => navigate(`/tweetx/user/${tweet.author_username}`)}>
                            @{tweet.author_username}
                          </p>
                          <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide">
                            • {tweet.date}
                          </p>
                        </div>
                        <div>
                          <button>
                            <FiMoreHorizontal />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm max-w-20">
                        <p className="max-w-20">{tweet.comment}</p>
                        {tweet?.image ? (
                          <>
                            <img
                              src={tweet.image}
                              className="h-max max-h-[420px] mt-px w-max rounded-xl ml-[-1px]"
                              alt="tweet_photo"
                            />
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        {/* <div className="fixed bottom-[43px] py-4 border-t border-gray-800 flex flex-row w-full px-2 bg-gray-900">
          <input
            type="text"
            className="w-full outline-none borer border-gray-800 bg-gray-800 rounded-full px-2 py-1 text-xs mx-2"
            placeholder="Tweet your reply"
            onChange={(e) => setReply(e.target.value)}
            value={reply}
            ref={inputRef}
          />
          <button
            className="px-4 py-[6px] rounded-full text-white text-xs bg-blue-600 font-semibold tracking-wide"
            onClick={() => handleReply()}
          >
            Reply
          </button>
        </div> */}
      </div>
    </>
  );
};

export default TweetPage;