import React, { useEffect, useState } from "react";
import { HiOutlineThumbDown, HiThumbDown } from "react-icons/hi";
import { AiOutlineDelete, AiOutlineFlag } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io"
import { MdVerified } from "react-icons/md"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Config/firebase-config";
import { useNavigate } from "react-router-dom";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../Config/firebase-config";
import DLconfirmation from "./DLconfirmation";
import {
  AiOutlineLink
} from "react-icons/ai";

const ToolModal = ({ av, name, usn, date, text, img, onClose, vType, id, postId, onConfirm }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userNotInt, setUserNotInt] = useState([]);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    if (user) {
      fetchUserNotInterestedList()
    }
  }, [user])
  const copyToClipboard = () => {
    const currentUrl = `https://tweetx-kappa.vercel.app/post/${postId}`;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => alert("URL copied to clipboard!"))
      .then(() => onClose())
      .catch((err) => console.error("Failed to copy URL to clipboard:", err));

  };
  const fetchUserNotInterestedList = async () => {
    const querySnapshot = await getDoc(doc(db, "userData", user.uid))
    setUserNotInt(
      querySnapshot.data().userDisliked
    )
    console.log(
      querySnapshot.data().userDisliked
    )
  }
  const handleUserNotInterestedChange = async (id) => {
    let newArr;
    const index = userNotInt.indexOf(id);
    if (index !== -1) {
      newArr = userNotInt.slice();
      newArr.splice(index, 1);
    } else {
      newArr = [...userNotInt, id];
    }
    setUserNotInt(newArr)
    callOnClose()
    onConfirm()
    await updateDoc(doc(db, "userData", user.uid), {
      userDisliked: newArr
    })
  }
  const deletePost = async (id) => {
    await deleteDoc(doc(db, "tweets", id))
    console.log("deleted post", id)
    callOnClose()
  }
  const callOnClose = () => {
    onClose()
  }
  return (
    <div className="container h-full w-full px-2 flex flex-col justify-center pt-3 backdrop-blur-md bg-[#111827bb]">
      <div className="modalt flex flex-col w-full h-max max-h-max backdrop-blur-lg border border-gray-800 rounded-xl p-2 relative">
        <div className="flex flex-row justify-end w-full px-2 absolute top-[10px] right-[0px]">
          <button onClick={onClose} className="text-lg"><IoMdCloseCircle /></button>
        </div>
        <div className="flex flex-col border-gray-800 border-b mt-1 usertweet-details">
          <div className="flex flex-row py-3">
            <div className="w-[40px] min-w-[35px] h-full">
              <img
                onClick={() => navigate(`/tweetx/user/${usn}`)}
                src={av}
                className="rounded-3xl h-8 w-8 mt-[-6px]"
                alt="user_profile_photo"
              />
            </div>
            <div className="w-full h-max flex flex-col px-1">
              <div className="flex flex-row justify-between mt-[-8px] text-xs">
                <div className="w-max flex flex-row">
                  <p
                    className="mr-1 font-semibold flex flex-row items-center truncate"
                    onClick={() => navigate(`/tweetx/user/${usn}`)}
                  >
                    {name}
                    {vType === "user" ? <MdVerified className="text-[14px] ml-1 text-blue-500" title="Verified User Of Tweetx" /> : null}
                    {vType === "dev" ? <MdVerified className="text-[14px] ml-1 text-yellow-500" title="Verified Developer Of Tweetx" /> : null}
                    {vType === "company" ? <MdVerified className="text-[14px] ml-1 text-yellow-500" title="Official Account Of Tweetx" /> : null}
                  </p>
                  {/* <p className="mr-2 text-gray-500 text-xs mt-[-1px] tracking-wide">
                    @{usn} • {date}
                  </p> */}
                  <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide truncate max-w-[80px]">
                    @{usn}
                  </p>
                  <p className="mr-1 text-gray-500 text-xs mt-[-1px] tracking-wide">
                    • {date}
                  </p>
                </div>
              </div>
              <div>
                <p className="max-w-20">{text}</p>
                {img ? (
                  <>
                    <img
                      src={img}
                      className="h-full max-h-[380px] mt-px w-full rounded-xl ml-[-1px]"
                      alt="tweet_photo"
                    />
                  </>
                ) : null}
                {/* {img ? "Includes Attachments" : null} */}
              </div>
            </div>
          </div>
        </div>
        <div className="usertweet-actions flex flex-col py-2">
          {/* <h4 className="text-md font-semibold tracking-wide">Actions</h4> */}
          <div className="flex flex-row w-max justify-between items-center py-1 px-2">
            <button
              className="text-blue-400 mr-8 mt-1 text-sm flex flex-row items-center"
              title="not interested"
              onClick={() => handleUserNotInterestedChange(id)}
            >
              {/* Not Interested */}
              {userNotInt.includes(id) ? (
                <HiThumbDown className="text-lg" />
              ) : (
                <HiOutlineThumbDown className="text-lg" />
              )}
            </button>
            <button
              className="text-blue-400 mr-8 mt-1 text-sm flex flex-row items-center"
              title="report"
              onClick={() => navigate(`/report`)}
            >
              {/* Report */}
              <AiOutlineFlag className="text-lg" />
            </button>
            <button
              className="text-blue-400 mr-8 mt-1 text-sm flex flex-row items-center"
              title="report"
              onClick={() => copyToClipboard()}
            >
              <AiOutlineLink className="text-lg" />
            </button>
            {user?.uid === id ?
              <button
                className="mr-8 mt-1 text-sm text-red-500 flex flex-row items-center"
                title="delete"
                onClick={() => deletePost(postId)}
              >
                {/* Delete */}
                <AiOutlineDelete className="text-lg" />
              </button>
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolModal;
