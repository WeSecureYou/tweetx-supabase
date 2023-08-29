import React from "react";
import WriteTweet from "./WriteTweet";

const Home = () => {
  return (
    <div className="w-full h-full dark:bg-gray-900 dark:text-white">
      <div className="h-10 px-2 py-px border-b border-gray-800 hidden md:flex">
        <h1 className="md:text-3xl text-xl font-bold md:font-black">Home</h1>
      </div>
      <div className="hidden md:flex">
        <WriteTweet />
      </div>
      <h1>You don't follow anyone yet</h1>
    </div>
  );
};

export default Home;
