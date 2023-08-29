import React from "react";
import { BiHomeAlt2, BiSearch, BiUserCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Config/firebase-config";
import { useEffect, useState } from "react";
import { RiSearchLine, RiHome7Fill, RiUser3Fill } from "react-icons/ri"
import { version } from "../Service/Service";
import { doc, getDoc } from "firebase/firestore";
const Footer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [profile, setProfile] = useState()
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    if (user) {
      fetchUserProfile(user.uid)
    }
  }, [user]);
  const fetchUserProfile = async(id) => {
    const querySnapshot = await getDoc(doc(db, "userData", id))
    setProfile(querySnapshot.data())
  }
  return (
    <div className="bg-[#111827bb] border-t backdrop-blur border-gray-800 w-full h-11 px-16 py-3 text-white flex flex-row items-center justify-between fixed bottom-0">
      <button onClick={() => navigate("/")} className="text-xl">
        <RiHome7Fill />
      </button>
      <button className="text-xs font-bold tracking-wide text-gray-400 cursor-not-allowed">
        {/* <RiSearchLine /> */}
        {version}
      </button>
        {user ? (
          <button onClick={() => navigate(`/tweetx/user/${profile.userName}`)} className="mt-1">
            <img
              className="rounded-full h-5 w-5"
              src={user?.photoURL}
              alt="user_profile_photo"
            />
          </button>
        ) : (
          <button className="text-xl">
            <RiUser3Fill />{" "}
          </button>
        )}
    </div>
  );
};

export default Footer;
