import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, logout } from "../Config/firebase-config";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import LikedTweets from "./LikedTweets";
import Retweets from "./Retweets";
import Bookmarks from "./Bookmarks";
import { useParams } from "react-router-dom";
import UserTweets from "./UserTweets";
import { MdVerified } from "react-icons/md";
// import { HiCodeBracket } from "react-icons/hi2"
import { AiOutlineInfoCircle } from "react-icons/ai";
import LoadingScreen from "./LoadingScreen";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import VerificationInfoModal from "./VerificationInfoModal";
import EditProfileModal from "./EditProfileModal";

const Profile = () => {
  const navigate = useNavigate();
  const userId = useParams();
  const [loading, setLoading] = useState(true);
  const [changeTitle, setChangeTitle] = useState(false);
  const [user, setUser] = useState();
  const [currentUser, setCurrentUserId] = useState();
  const [userTweets, setUserTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [retweetedTweets, setRetweetedTweets] = useState([]);
  const [bookmarkedTweets, setBookmarkedTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("tweets");
  const [verificationModal, setVerificationModal] = useState(false);
  const [vType, setVType] = useState();
  const [editProfileModal, setEditProfileModal] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentUserId(currentUser);
    });
    fetchUserProfile(userId.id);
    fetchUserData(userId.id);
    fetchUserTweets(userId.id);
  }, [userId.id]);
  useEffect(() => {
    if (user) {
      pushVType();
    } else {
      console.log("didnt workd");
    }
  }, [user]);
  const fetchUserTweets = async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "tweets"));
      setUserTweets(
        querySnapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((tweet) => tweet.author_username === userId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  const closeVerificationModal = () => {
    setVerificationModal(false);
  };
  const fetchUserProfile = async (id) => {
    try {
      const querySnapshot = await getDoc(doc(db, "profiles", id));
      setUser(querySnapshot.data());
      setChangeTitle(true);
      console.log(querySnapshot.data());
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (changeTitle === true) {
      document.title = `Profile ${user.displayName ? user.displayName : null
        } / TweetX`;
    }
  }, [changeTitle]);
  const fetchUserData = async (currentUser) => {
    if (currentUser) {
      const userDocRef = doc(db, "profiles", currentUser);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        fetchLikedTweets(userSnapshot.data().likes);
        fetchRetweetedTweets(userSnapshot.data().retweets);
        fetchBookmarkedTweets(userSnapshot.data().bookmarks);
        setLoading(false);
      }
    }
  };
  const fetchLikedTweets = async (likes) => {
    const likedTweetsPromises = likes.map(async (tweetId) => {
      const tweetDocRef = doc(db, "tweets", tweetId);
      const tweetSnapshot = await getDoc(tweetDocRef);
      if (tweetSnapshot.exists()) {
        return {
          ...tweetSnapshot.data(),
          id: tweetSnapshot.id, // Add the ID of the document to the data
        };
      }
    });
    const likedTweetsData = await Promise.all(likedTweetsPromises);
    setLikedTweets(likedTweetsData.filter((tweet) => tweet));
  };
  const fetchRetweetedTweets = async (retweets) => {
    // Similar to fetchLikedTweets, fetch retweeted tweets based on tweet IDs
    // and store them in the state variable.
    const retweetPromises = retweets.map(async (tweetId) => {
      const tweetDocRef = doc(db, "tweets", tweetId);
      const tweetSnapshot = await getDoc(tweetDocRef);
      if (tweetSnapshot.exists()) {
        return {
          ...tweetSnapshot.data(),
          id: tweetSnapshot.id, // Add the ID of the document to the data
        };
      }
    });
    const retweetsData = await Promise.all(retweetPromises);
    setRetweetedTweets(retweetsData.filter((tweet) => tweet));
  };
  const fetchBookmarkedTweets = async (bookmarks) => {
    // Similar to fetchLikedTweets and fetchRetweetedTweets,
    // fetch bookmarked tweets based on tweet IDs and store them in the state variable.
    const bookmarkPromises = bookmarks.map(async (tweetId) => {
      const tweetDocRef = doc(db, "tweets", tweetId);
      const tweetSnapshot = await getDoc(tweetDocRef);
      if (tweetSnapshot.exists()) {
        return {
          ...tweetSnapshot.data(),
          id: tweetSnapshot.id, // Add the ID of the document to the data
        };
      }
    });
    const bookmarkData = await Promise.all(bookmarkPromises);
    setBookmarkedTweets(bookmarkData.filter((tweet) => tweet));
  };
  const pushVType = () => {
    if (user.isVerified === true) {
      setVType("user");
    } else if (user.isDev === true) {
      setVType("dev");
    } else if (user.isCompany === true) {
      setVType("company");
    }
  };
  const onCloseFunction = () => {
    setEditProfileModal(false);
  };
  const coverImage =
    "https://e0.pxfuel.com/wallpapers/141/802/desktop-wallpaper-ultrawide-21-9-collection-3440-updated-regularly-funny-twitter-headers-twitter-header-quotes-twitter-header-aesthetic-ultrawide.jpg";
  if (loading) return <LoadingScreen />;
  return (
    <div className="bg-gray-900 min-h-screen">
      {verificationModal && (
        <VerificationInfoModal type={vType} onClose={closeVerificationModal} />
      )}
      {editProfileModal && (
        <EditProfileModal username={user?.userName} onClose={onCloseFunction} />
      )}
      <div>
        <button
          onClick={() => navigate("/")}
          className="ml-3 top-[15px] text-md absolute top-0 blackdrop p-1 rounded-full backdrop-blur-md"
        >
          <BiArrowBack />
        </button>
        <div className="bg-blue-400 h-28">
          {user.bannerURL ? (
            <img
              src={user.bannerURL}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="p-1 border-b border-gray-800">
          <div className="flex flex-col relative items-center space-x-4">
            <div className="w-full h-max flex flex-row justify-between items-center">
              <div>
                <img
                  src={user?.photoURL}
                  alt="Avatar"
                  className="w-16 h-16 left-3 top-[-25px] absolute rounded-full border-4 border-gray-900"
                />
              </div>
              <div className="py-2 px-4">
                <button
                  onClick={() => setEditProfileModal(true)}
                  className="py-1 px-2 bg-transparent border-gray-400 border text-gray-400 rounded-full text-xs font-semibold"
                >
                  Edit profile
                </button>
              </div>
            </div>
            <div className="mt-0 flex flex-col w-full px-2">
              <h2 className="text-xl font-bold flex flex-row items-center">
                {user?.displayName}
                {user?.isVerified ? (
                  <MdVerified
                    onClick={() => setVerificationModal(true)}
                    className="text-[17px] ml-1 text-blue-500"
                    title="Verified User Of Tweetx"
                  />
                ) : null}
                {user?.isDev ? (
                  <MdVerified
                    onClick={() => setVerificationModal(true)}
                    className="text-[17px] ml-1 text-yellow-500"
                    title="Verified Developer Of Tweetx"
                  />
                ) : null}
                {user?.isCompany ? (
                  <MdVerified
                    onClick={() => setVerificationModal(true)}
                    className="text-[17px] ml-1 text-yellow-500"
                    title="Official Account Of Tweetx"
                  />
                ) : null}
              </h2>
              <p className="text-gray-500 text-sm font-semibold mt-[-4px]">
                {user?.userName ? (
                  <>@{user?.userName}</>
                ) : (
                  <>@{user?.displayName.replace(" ", "_").toLowerCase()}</>
                )}
              </p>
              {user?.bio ? (
                <p className="text-gray-200 text-sm font-semibold mt-2 ml-px">
                  {user?.bio}
                </p>
              ) : null}
              <div className="flex flex-row w-full items-start font-semibold mt-1 ml-px">
                <p className="text-xs text-gray-500 pb-2 mt-1">
                  <span className="text-white">{user?.followers.length}</span>{" "}
                  {user?.followers.length === 1 ? "Follower" : "Followers"}
                </p>
                <p className="text-xs text-gray-500 pb-2 mt-1 ml-2">
                  <span className="text-white">{user?.following.length}</span>{" "}
                  Following
                </p>
              </div>
              {/* Add more profile information as needed */}
            </div>
          </div>
        </div>
        <div className="pb-10">
          <ul className="px-5 flex text-xs tracking-wide font-semibold border-b border-gray-800">
            <li
              className={`cursor-pointer mr-6 py-2 ${activeTab === "tweets"
                  ? "text-white border-blue-500 border-b-2"
                  : "text-gray-500"
                }`}
              onClick={() => setActiveTab("tweets")}
            >
              Posts
            </li>
            <li
              className={`cursor-pointer mr-6 py-2 ${activeTab === "liked"
                  ? "text-white border-blue-500 border-b-2"
                  : "text-gray-500"
                }`}
              onClick={() => setActiveTab("liked")}
            >
              Likes
            </li>
            <li
              className={`cursor-pointer mr-6 py-2 ${activeTab === "retweeted"
                  ? "text-white border-blue-500 border-b-2"
                  : "text-gray-500"
                }`}
              onClick={() => setActiveTab("retweeted")}
            >
              Reposts
            </li>
            {user.uid === currentUser?.uid ? (
              <li
                className={`cursor-pointer mr-6 py-2 ${activeTab === "bookmarked"
                    ? "text-white border-blue-500 border-b-2"
                    : "text-gray-500"
                  }`}
                onClick={() => setActiveTab("bookmarked")}
              >
                Bookmarks
              </li>
            ) : null}
          </ul>
          <div className="">
            {loading ? ( // Show loading state until user data is fetched
              <p>Loading...</p>
            ) : (
              <>
                {activeTab === "tweets" && <UserTweets tweets={userTweets} />}
                {activeTab === "liked" && (
                  <LikedTweets likedTweets={likedTweets} />
                )}
                {activeTab === "retweeted" && (
                  <Retweets retweets={retweetedTweets} />
                )}
                {user.uid === currentUser?.uid ? (
                  <>
                    {activeTab === "bookmarked" && (
                      <Bookmarks bookmarks={bookmarkedTweets} />
                    )}
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
