import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../Config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { fullDate } from "../Service/Service";
import { BiArrowBack } from "react-icons/bi";
import LoadingScreen from "./LoadingScreen";
import { supabase } from "../supabaseClient";
const AddTweetModal = () => {
  const navigate = useNavigate();
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState();
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      fetchUserProfile(currentUser.uid)
      setLoading(false)
    });
  }, [user]);
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };
  const fetchUserProfile = async (id) => {
    try {
      const { data, error } = await supabase.from("userRegistrar").select("*").eq("id", id).single()
      if (data !== null) {
       queryNewDb(data.userName) 
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  }
  const queryNewDb = async (id) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()
      if (data !== null) {
        setUserProfile(data)
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  }
  async function addTweet() {
    const currentTime = getCurrentTime();
    let userName
    if (userProfile.userName) {
      userName = userProfile.userName
    }
    else {
      userName = user.displayName.replace(" ", "_").toLowerCase()
    }
    try {
      const { error } = await supabase.from("posts").insert(
        {
          text: desc,
          image: url ? url : "",
          comments: [],
          users_who_liked: [],
          users_who_reposted: [],
          users_who_bookmarked: [],
          author_name: user.displayName,
          author_av: user.photoURL,
          author_username: userName,
          author_id: user.uid,
          OperatingSystem: navigator.appVersion,
          planet: "Earth",
          specie: "Human",
          time: currentTime,
          date: fullDate,
          userId: user.uid,
          verificationType: user.verificationType,
        }
      )
      if (error) throw error
      console.log("tweet added")
      setUrl("")
      setDesc("")
      navigate("/")
    }
    catch (e) {
      console.log(e)
    }
  }
  if (loading) return <LoadingScreen />
  return (
    <div className="container h-max overflow-hidden">
      <div className="w-full h-max flex flex-row items-center justify-between px-2 py-3 border-b border-gray-800">
        <button className="text-white text-sm" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button
          className="px-3 py-[6px] rounded-full text-white text-xs bg-blue-600 font-semibold tracking-wide"
          onClick={() => addTweet()}
        >
          Post
        </button>
      </div>
      <div className="flex flex-row h-full w-full py-4">
        <div className="px-2 w-[55px]">
          <img
            src={user?.photoURL}
            className="rounded-3xl h-8 w-8"
            alt="user_profile_photo"
          />
        </div>
        <div className="flex flex-col w-full pr-4">
          <label htmlFor="tweet_description" className="text-xs text-white font-bold tracking-wide mt-0">Tweet</label>
          <textarea className="px-2 py-2 resize-none bg-transparent text-xs mt-px text-white border rounded-md border-gray-800 outline-none" name="tweet_description" id="tweet_description" cols="30" rows="20" placeholder="Write your thoughts" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
          <label htmlFor="thumbnail" className="text-xs text-white font-bold tracking-wide mt-7">Image [optional]</label>
          <input className="px-2 py-[6px] rounded-md outline-none text-white text-xs mt-px border-gray-800 bg-gray-900" type="text" id="thumbnail" name="thumbnail" placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default AddTweetModal;
