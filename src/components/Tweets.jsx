import React, { useEffect, useState, useRef } from "react";
import {
  AiOutlineRetweet,
  AiOutlinePlus,
  AiOutlineCode,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import ReactTimeAgo from 'react-time-ago'
import { RiChat1Line } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import AddTweetModal from "./AddTweetModal";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../Config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import ToolModal from "./ToolModal";
import { MdVerified } from "react-icons/md";
import Header from "../components/Header";
import DLconfirmation from "./DLconfirmation";
import { supabase } from "../supabaseClient";
import { logout } from "../Config/DatabaseReworked";
const Tweets = () => {
  const tweetRef = collection(db, "tweets");
  const navigate = useNavigate();
  const [tweetData, setTweetData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [showTweetModal, setShowTweetModal] = useState(false);
  const [currentTweetModalData, setCurrentTweetModalData] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCurrentUserId(currentUser.uid);
      document.title = "Home / TweetX";
    });
  }, [user]);
  useEffect(() => {
    // Event listener to hide the dropdown when the user scrolls
    const handleScroll = () => {
      setShowTweetModal(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    fetchTweets();
  }, []);
  async function fetchTweets() {
    try {
      const { data, error } = await supabase.from("posts").select("*")
      if(error) throw error
      if (data != null) {
        setTweetData(data)
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  function tweetActions(av, name, usn, date, text, img, vType, id, postId) {
    if (text !== "") {
      // If data is available, close the modal
      setShowTweetModal(true);
    } else {
      // If data is not available, open the modal
      setShowTweetModal(false);
    }
    setCurrentTweetModalData({
      av,
      name,
      usn,
      date,
      text,
      img,
      vType,
      id,
      postId,
    });
  }
  function closeTweetModal() {
    // Function to handle closing the tweet modal
    setShowTweetModal(false);
    fetchTweets();
  }
  const showConfirmation = () => {
    return <DLconfirmation />;
  };

  const parseTweetText = (text, tweetId) => {
    const mentionRegex = /@(\w+)/g;

    const parts = text.split(mentionRegex);

    const parsedText = parts.map((part, index) => {
      if (index % 2 === 1) {
        const username = part;
        return (
          <Link
            key={index}
            to={`/tweetx/user/${username}`}
            className="text-blue-500 hover:underline"
          >
            @{username}
          </Link>
        );
      } else {
        return (
          <Link key={index} to={`/post/${tweetId}`} className="">
            {part}
          </Link>
        );
      }
    });

    return <>{parsedText}</>;
  };

  if (loading) return <LoadingScreen />;
  return (
    <>
      <Header />
      {showTweetModal && (
        <>
          <div className="fixed h-screen fixed top-0 z-50 w-full">
            <ToolModal
              av={currentTweetModalData?.av}
              name={currentTweetModalData?.name}
              usn={currentTweetModalData?.usn}
              date={currentTweetModalData?.date}
              text={currentTweetModalData?.text}
              img={currentTweetModalData?.img}
              onClose={closeTweetModal}
              vType={currentTweetModalData?.vType}
              id={currentTweetModalData?.id}
              postId={currentTweetModalData?.postId}
              onConfirm={showConfirmation}
            />
          </div>
        </>
      )}
      <div className="pb-10 bg-gray-900 relative h-max max-h-max overflow-auto">
        {/* {toggleModal ? <AddTweetModal /> : null} */}
        <button onClick={() => logout()}>Logout</button>
        {tweetData.map((tweet) => {
          return (
            <div key={tweet?.id}>
              <button
                className="md:hidden fixed right-3 top-[85.5%] p-3 bg-blue-300 rounded-full text-gray-800 text-xl font-black"
                onClick={() => navigate("/write-tweet")}
              >
                <AiOutlinePlus />
              </button>
              <button
                className="md:hidden fixed right-3 top-[77.5%] p-3 bg-black rounded-full text-white text-xl font-black"
                onClick={() => navigate("/admin")}
              >
                <AiOutlineCode />
              </button>
              <div className="h-max w-full max-h-max overflow-hidden">
                <div className="flex flex-row py-6 px-2 border-gray-800 border-b">
                  <div
                    className="w-[40px] min-w-[35px] h-full"
                    onClick={() =>
                      navigate(`/tweetx/user/${tweet?.author_username}`)
                    }
                  >
                    <img
                      src={tweet?.author_av}
                      className="rounded-full h-8 w-8 mt-[-6px] cursor-pointer"
                      alt="user_profile_photo"
                    />
                  </div>
                  <div className="w-full h-max flex flex-col px-1 max-w-[calc(100% - 48px)]">
                    <div className="flex flex-row justify-between items-center mt-[-12px] text-xs">
                      <div className="w-max flex flex-row">
                        <p
                          className="mr-1 font-semibold flex flex-row items-center truncate hover:underline cursor-pointer"
                          onClick={() =>
                            navigate(`/tweetx/user/${tweet?.author_username}`)
                          }
                        >
                          {tweet?.author_name}
                          {tweet?.verificationType === "user" ? (
                            <MdVerified
                              className="text-[14px] ml-1 text-blue-500"
                              title="Verified User Of Tweetx"
                            />
                          ) : null}
                          {tweet?.verificationType === "dev" ? (
                            <MdVerified
                              className="text-[14px] ml-1 text-yellow-500"
                              title="Verified Developer Of Tweetx"
                            />
                          ) : null}
                          {tweet?.verificationType === "company" ? (
                            <MdVerified
                              className="text-[14px] ml-1 text-yellow-500"
                              title="Official Account Of Tweetx"
                            />
                          ) : null}
                        </p>
                        <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide truncate max-w-[80px]">
                          @{tweet?.author_username}
                        </p>
                        <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide">
                          {/* • {tweet?.date} */}
                          • {" "}
                          <ReactTimeAgo date={tweet.created_at} locale="en-US"/>
                        </p>
                      </div>
                      <div>
                        <div className="relative">
                          <button
                            className="text-lg"
                            onClick={() =>
                              tweetActions(
                                tweet?.author_av,
                                tweet?.author_name,
                                tweet?.author_username,
                                tweet?.date,
                                tweet?.text,
                                tweet?.image,
                                tweet?.verificationType,
                                tweet?.author_id,
                                tweet?.id
                              )
                            }
                          >
                            <FiMoreHorizontal />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-sm mt-[-1px] max-w-[calc(100% - 48px)] flex flex-col cursor-pointer"
                      onClick={() => navigate(`/post/${tweet.author_username}/${tweet.id}`)}
                    >
                      <p className="max-w-20 flex-wrap">
                        {parseTweetText(tweet?.text, tweet.id)}
                      </p>
                      {tweet?.image ? (
                        <>
                          <img
                            src={tweet.image}
                            onClick={() => navigate("/post/" + tweet?.id)}
                            className="h-max full max-h-[420px] mt-px w-full rounded-xl ml-[-1px]"
                            alt="tweet_photo"
                          />
                        </>
                      ) : null}
                    </div>
                    <div className="mt-2 text-md flex flex-row">
                      <button className="mr-4 flex flex-row">
                        {tweet.users_who_liked?.includes(currentUserId) ? (
                          <AiFillHeart className="text-red-500" />
                        ) : (
                          <AiOutlineHeart />
                        )}
                        <p className="ml-1 text-xs">
                          {tweet.users_who_liked?.length === 0
                            ? null
                            : tweet.users_who_liked?.length}
                        </p>
                      </button>
                      <button className="mr-4 flex flex-row">
                        {tweet.users_who_retweeted?.includes(currentUserId) ? (
                          <AiOutlineRetweet className="text-green-500" />
                        ) : (
                          <AiOutlineRetweet />
                        )}
                        <p className="ml-1 text-xs">
                          {tweet.users_who_retweeted?.length === 0
                            ? null
                            : tweet.users_who_retweeted?.length}
                        </p>
                      </button>
                      <button className="mr-4 flex flex-row">
                        <RiChat1Line />
                        <p className="ml-1 text-xs">
                          {tweet.comments?.length === 0
                            ? null
                            : tweet.comments?.length}
                        </p>
                      </button>
                      {/* NOTE: DEPRECEATED */}
                      {/* <button className="mr-4">
                      <IoShareOutline />
                    </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Tweets;
