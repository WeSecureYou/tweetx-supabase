import React, { useEffect, useState } from "react";
import { signInWithGoogle } from "../Config/DatabaseReworked";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Config/firebase-config";
import { logout } from "../Config/firebase-config";
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      document.title = "Login / TweetX"
    });
  }, [user]);
  const logo = "https://firebasestorage.googleapis.com/v0/b/tweetx-385019.appspot.com/o/X-logo-removebg-preview.png?alt=media&token=a66d7461-a768-41d9-9a33-4a5b18d6937a"

  return (
    <>
      {/* <h1 className="text-3xl font-bold ml-2 mt-2">{user?.displayName}</h1>
      <p className="ml-2">{user?.email}</p>
      <p className="ml-2 text-xs text-gray-400">{user?.uid}</p>
      <button
        className="rounded-md p-2 px-4 mt-2 bg-blue-600 text-white ml-2"
        onClick={() => signInWithGoogle()}
      >
        Sign in with google
      </button>
      <button
        className="rounded-md p-2 px-4 mt-4 bg-blue-600 text-white ml-2"
        onClick={() => logout()}
      >
        Logout
      </button> */}
        <div className="h-screen w-full bg-gray-900 fixed top-0 z-10 flex flex-col">
        <div className="flex flex-row items-start py-2 px-1">
          <img src={logo} alt="login_logo" className="w-36 h-36 mt-5" />
        </div>
        <div className="flex flex-row w-full items-start px-10">
          <h1 className="secondary-font text-2xl font-black tracking-wide">Happening now</h1>
        </div>
        <div className="flex flex-row w-full items-start px-10 mt-10">
          <h1 className="secondary-font text-lg font-black tracking-wide">Join today.</h1>
        </div>
        <div className="flex flex-col px-10 mt-2">
          <div className="flex flex-row items-center w-full rounded-[999px] bg-white py-3 justify-center text-black text-sm font-semibold tracking-wide"
          onClick={() => signInWithGoogle()}
          >
            <FcGoogle className="text-xl mr-1" />
            Sign up with Google
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 px-10">
          <span className="w-full border-b border-gray-600 lg:w-1/5"></span>
          <p className="w-max px-4">or</p>
          <span className="w-full border-b border-gray-600 lg:w-1/5"></span>
        </div>
        <div className="flex flex-col px-10 mt-4">
          <div className="flex flex-row items-center w-full rounded-[999px] bg-blue-400 py-3 justify-center text-white text-sm font-bold tracking-wide">
            Create Account
          </div>
        </div>
        <div className="flex flex-row px-10 text-gray-500 mt-2">
          <p className="text-xs">
          By signing up, you agree with to the <span className="text-blue-500">Terms of Service</span> and <span className="text-blue-500">Privacy Policy</span> including <span className="text-blue-500">Cookie use.</span> 
          </p>
        </div>
        <div className="mt-12 px-10 flex flex-col">
          <h3 className="text-lg font-semibold tracking-wide">Already have an account?</h3>
          <div className="mt-2 flex flex-row items-center w-full rounded-[999px] bg-transparent py-3 justify-center text-blue-400 border border-gray-600 text-sm font-bold tracking-wide">
            Sign in
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
