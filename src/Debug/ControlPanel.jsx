import React from "react";
import { useState, useEffect } from "react";
import { db } from "../Config/firebase-config";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import LoadingScreen from "../components/LoadingScreen";
import { ImDatabase } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import { ImUserMinus } from "react-icons/im"
import { RiUserSearchFill } from "react-icons/ri"
const ControlPanel = () => {
  const tweetRef = collection(db, "tweets");
  const [id, setId] = useState("");
  const [tweetData, setTweetData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = "Data Registrar / TweetX"
    fetchTweets();
    fetchUserRecord();
    setLoading(false);
  }, []);
  async function fetchTweets() {
    try {
      const querySnapshot = await getDocs(tweetRef);
      setTweetData(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchUserRecord() {
    try {
      const querySnapshot = await getDocs(collection(db, "userData"));
      setUserData(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteDocument(type) {
    if (id !== "") {
      if (type === "tweet") {
        const tweetRef = doc(db, "tweets", id);
        await deleteDoc(tweetRef);
        alert("Document has been deleted from database");
        window.location.reload();
      }
      else if (type === "user") {
        const userRef = doc(db, "userData", id);
        await deleteDoc(userRef);
        alert("User has been deleted from database");
        window.location.reload();
      }
    } else {
      alert("Please select an appropriate document");
    }
  }
  if (loading) return <LoadingScreen />;
  return (
    <div className="flex flex-col">
      <p className="text-xl font-bold tracking-wide uppercase ml-1 mt-1">Post Record(s)</p>
      <select
        name="tweets"
        id="tweets"
        className=" px-1 mt-1 rounded-md bg-gray-800 text-white max-w-max overflow-hidden text-xs mx-1 outline-none border-none py-2"
        onChange={(e) => setId(e.target.value)}
        defaultValue=""
        placeholder="Select a document"
      >
        <option value="">
          Select - {tweetData.length} Post(s) Found
        </option>
        {tweetData.map((tweet) => {
          return (
            <option value={tweet.id} className="max-w-full">
              {tweet.text ? tweet.text : tweet.image} - Comment(s) : {tweet.comments.length}  Like(s) : {tweet.users_who_liked.length}  Repost(s) : {tweet.users_who_retweeted.length}  Bookmark(s) : {tweet.users_who_bookmarked.length}
            </option>
          );
        })}
      </select>
      <div className="w-max flex flex-row flex-wrap max-w-[100%] overflow-hidden items-center mt-2 ml-1">
        <button
          className="px-3 py-[7px] flex flex-row items-center rounded-md text-white text-xs bg-red-600 font-semibold tracking-wide w-max"
          onClick={() => deleteDocument("tweet")}
        >
          Delete Document
          <AiFillDelete className="ml-1 text-md" />
        </button>
        <Link
          className="px-3 py-[7px] w-max flex flex-row items-center ml-2 rounded-md text-white text-xs bg-blue-600 font-semibold tracking-wide"
          to={
            id
              ? `https://console.firebase.google.com/project/tweetx-385019/firestore/data/~2Ftweets~2F${id}`
              : `https://console.firebase.google.com/project/tweetx-385019/firestore/data/~2Ftweets`
          }
          target="_blank"
        >
          Go To Database
          <ImDatabase className="ml-1" />
        </Link>
        <Link
          className="mt-2 md:ml-2 md:mt-0 px-3 py-[7px] w-max flex flex-row items-center rounded-md text-white text-xs bg-blue-600 font-semibold tracking-wide"
          to={
            id
              ? `https://tweetx-kappa.vercel.app/tweet/${id}`
              : `https://tweetx-kappa.vercel.app`
          }
          target="_blank"
        >
          Go To User Tweet
          <ImDatabase className="ml-1" />
        </Link>
      </div>
      <div className="flex flex-col mt-2">
        <p className="text-xl font-bold tracking-wide uppercase ml-1 mt-8">User Record(s)</p>
        <select
          name="tweets"
          id="tweets"
          className=" px-1 mt-1 rounded-md bg-gray-800 text-white max-w-max overflow-hidden text-xs mx-1 outline-none border-none py-2"
          onChange={(e) => setId(e.target.value)}
          defaultValue=""
          placeholder="Select a user record"
        >
          <option value="">
            Select - {userData.length} User Record(s) Found
          </option>
          {userData.map((user) => {
            return (
              <option value={user.id}>
                {user.displayName} • {user.email}
              </option>
            );
          })}
        </select>
        <div className="w-max flex flex-row flex-wrap max-w-[100%] overflow-hidden items-center mt-2 ml-1">
          <button
            className="px-3 py-[7px] flex flex-row items-center rounded-md text-white text-xs bg-red-600 font-semibold tracking-wide w-max"
            onClick={() => deleteDocument("user")}
          >
            Delete User
            <ImUserMinus className="ml-1 text-md" />
          </button>
          <Link
            className="px-3 py-[7px] w-max flex flex-row items-center ml-2 rounded-md text-white text-xs bg-blue-600 font-semibold tracking-wide"
            to={
              id
                ? `https://console.firebase.google.com/project/tweetx-385019/firestore/data/~2FuserData~2F${id}`
                : `https://console.firebase.google.com/project/tweetx-385019/firestore/data/~2FuserData`
            }
            target="_blank"
          >
            Go To User Record
            <RiUserSearchFill className="ml-1 text-md" />
          </Link>
          <Link
            className="px-3 py-[7px] w-max flex flex-row items-center md:ml-2 md:mt-0 mt-2 rounded-md text-white text-xs bg-blue-600 font-semibold tracking-wide"
            to={
              id
                ? `https://tweetx-kappa.vercel.app/tweetx/user/${id}`
                : `https://tweetx-kappa.vercel.app`
            }
            target="_blank"
          >
            Go To User Profile
            <RiUserSearchFill className="ml-1 text-md" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
