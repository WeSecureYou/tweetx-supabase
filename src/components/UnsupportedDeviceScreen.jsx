import React, { useEffect } from "react";
import { version } from "../Service/Service";

const UnsupportedDeviceScreen = () => {
  useEffect(() => {
    document.title = `TweetX / Unsupported Device ${version}`
  }, [])
  return (
    <div className="h-screen w-full items-center justify-center bg-gray-900 z-50">
      <div className="w-full flex flex-col items-center justify-center h-full">
        <img
          className="h-32 w-32"
          src="https://firebasestorage.googleapis.com/v0/b/tweetx-385019.appspot.com/o/X-logo-removebg-preview.png?alt=media&token=a66d7461-a768-41d9-9a33-4a5b18d6937a"
          alt="loading_gif"
        />
        <p className="text-xs font-bold tracking-wide text-gray-500">
          Unsupported Device ({version})
        </p>
      </div>
    </div>
  );
};

export default UnsupportedDeviceScreen;
