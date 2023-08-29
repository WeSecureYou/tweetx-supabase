import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Config/firebase-config";
import LoadingScreen from "./LoadingScreen";
import { MdVerified } from "react-icons/md"
import {
  AiOutlineRetweet,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { RiChat1Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
const UserTweets = ({ tweets }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);
  if (loading) return <LoadingScreen />;
  return (
    <div>
      {tweets.map((tweet) => (
        <>
          <div className="h-max w-full max-h-max overflow-hidden pt-4 mt-1">
            <div className="flex flex-row pb-4 px-4 border-gray-800 border-b">
              <div
                className="w-[40px] min-w-[35px] h-full"
                onClick={() => navigate(`/tweetx/user/${tweet.author_username}`)}
              >
                <img
                  src={tweet.author_av}
                  className="rounded-3xl h-8 w-8 mt-[-5px]"
                  alt="user_profile_photo"
                />
              </div>
              <div className="w-full h-max flex flex-col px-2">
                <div className="flex flex-row justify-between mt-[-8px] text-xs">
                  <div className="w-max flex flex-row">
                    <p
                      className="mr-2 font-semibold flex flex-row items-center"
                      onClick={() =>
                        navigate(`/tweetx/user/${tweet.author_username}`)
                      }
                    >
                      {tweet.author_name}
                      {tweet?.verificationType === "user" ? <MdVerified className="text-[14px] ml-1 text-blue-500" title="Verified User Of Tweetx" /> : null}
                      {tweet?.verificationType === "dev" ? <MdVerified className="text-[14px] ml-1 text-yellow-500" title="Verified Developer Of Tweetx" /> : null}
                      {tweet?.verificationType === "company" ? <MdVerified className="text-[14px] ml-1 text-yellow-500" title="Official Account Of Tweetx" /> : null}
                    </p>
                    <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide truncate max-w-[80px]">
                      @{tweet.author_username}
                    </p>
                    <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide">
                      • {tweet.date}
                    </p>
                  </div>
                </div>
                <div
                  className="text-sm mt-px max-w-20"
                  onClick={() => navigate("/post/" + tweet.id)}
                >
                  <p className="max-w-20">{tweet.text}</p>
                  {tweet?.image ? (
                    <>
                      <img
                        src={tweet.image}
                        className="h-max full max-h-[420px] mt-1 w-full rounded-xl ml-[-1px]"
                        alt="tweet_photo"
                      />
                    </>
                  ) : null}
                </div>
                <div className="mt-2 text-md flex flex-row">
                  <button className="mr-4 flex flex-row">
                    {tweet.users_who_liked.includes(user.uid) ? (
                      <AiFillHeart className="text-red-500" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                    <p className="ml-1 text-xs">
                      {tweet.users_who_liked.length === 0
                        ? null
                        : tweet.users_who_liked.length}
                    </p>
                  </button>
                  <button className="mr-4 flex flex-row">
                    {tweet.users_who_retweeted?.includes(user.uid) ? (
                      <AiOutlineRetweet className="text-green-500" />
                    ) : (
                      <AiOutlineRetweet />
                    )}
                    <p className="ml-1 text-xs">
                      {tweet.users_who_retweeted.length === 0
                        ? null
                        : tweet.users_who_retweeted.length}
                    </p>
                  </button>
                  <button className="mr-4 flex flex-row">
                    <RiChat1Line />
                    <p className="ml-1 text-xs">
                      {tweet.comments.length === 0
                        ? null
                        : tweet.comments.length}
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
        </>
      ))}
    </div>
  );
};

export default UserTweets;
