import React from "react";
import "./App.css";
import TweetRoutes from "./routes/TweetRoutes.jsx"
function App() {
  return (
    <div className="App font-inter bg-gray-900 text-white dark:bg-gray-900 dark:text-white">
      <TweetRoutes />
    </div>
  )
}
export default App