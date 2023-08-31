import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import AddTweetModal from "../components/AddTweetModal";
import ExploreTweets from "../components/ExploreTweets";
import Login from "../auth/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Config/firebase-config";
import { useEffect, useState } from "react";
import Four04 from "../errorPage/Four04";
import Four05 from "../errorPage/Four05";
import TweetPage from "../components/TweetPage";
import ControlPanel from "../Debug/ControlPanel";
import Profile from "../components/Profile";
import UnsupportedDeviceScreen from "../components/UnsupportedDeviceScreen";
import TweetingTool from "../Confidential/TweetingTool";
import CreateUserAccount from "../Confidential/CreateUserAccount";
import VerificationSystem from "../Confidential/VerificationSystem";
import QuickLinks from "../Confidential/QuickLinks";
import ReportPage from "../components/ReportPage";
import DLconfirmation from "../components/DLconfirmation";
import DataTransfer from "../Confidential/DataTransfer";
import VerificationInfoModal from "../components/VerificationInfoModal";
import CreateAccount from "../auth/CreateAccount";
const TweetRoutes = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, [user]);
  if (loading) return <LoadingScreen />;
  return (
    <>
      {/* <Header /> */}
      <Routes>
        {user?.uid === "vdEjimhB3FhvYlesebKKqrXO8F12" ? (
          <>
            <Route path="/tools/admin/admin-panel" element={<ControlPanel />} />
            <Route
              path="/tools/admin/tweeting-tool"
              element={<TweetingTool />}
            />
            <Route
              path="/tools/admin/create-account"
              element={<CreateUserAccount />}
            />
            <Route
              path="/tools/admin/verification-tool"
              element={<VerificationSystem />}
            />
            <Route path="/admin" element={<QuickLinks />} />
            <Route path="/dl" element={<DLconfirmation />} />
            <Route
              path="/tools/admin/data-transfer"
              element={<DataTransfer />}
            />
          </>
        ) : (
          <>
            <Route path="/tools/admin/data-transfer" element={<Four05 />} />
            <Route path="/admin" element={<Four05 />} />
            <Route path="/tools/admin/admin-panel" element={<Four05 />} />
            <Route path="/tools/admin/verification-tool" element={<Four05 />} />
            <Route path="/tools/admin/create-account" element={<Four05 />} />
            <Route path="/tools/admi/tweeting-tool" element={<Four05 />} />
          </>
        )}
        {window.innerWidth <= "426" ? (
          <>
            <Route path="*" element={<Four04 />} />
            <Route path="/post/:id" element={<TweetPage />} />
            {user ? (
              <>
                <Route path="/" element={<ExploreTweets />} />
                <Route path="/add" element={<AddTweetModal />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/tweetx/user/:id" element={<Profile />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/write-tweet" element={<AddTweetModal />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add" element={<Login />} />
                <Route path="/create-account" element={<Login />} />
                <Route path="/tweetx/user/:id" element={<Login />} />
                <Route path="/report" element={<Login />} />
                <Route path="/write-tweet" element={<Login />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/" element={<UnsupportedDeviceScreen />} />
            <Route path="*" element={<UnsupportedDeviceScreen />} />
          </>
        )}
      </Routes>
      <div className="md:hidden">
        <Footer />
      </div>
    </>
  );
};

export default TweetRoutes;
