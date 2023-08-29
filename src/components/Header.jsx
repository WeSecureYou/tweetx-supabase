import { GiHummingbird } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="h-max bg-gray-900 py-2 text-white w-full flex flex-row border-b border-gray-800 z-10">
        <div className="w-full justify-center flex flex-row">
          <h1 className="text-3xl text-blue-300" onClick={() => navigate("/")}>
            {/* <GiHummingbird /> */}
            <img className="h-9 w-9 cursor-pointer" src="https://firebasestorage.googleapis.com/v0/b/tweetx-385019.appspot.com/o/X-logo-removebg-preview.png?alt=media&token=a66d7461-a768-41d9-9a33-4a5b18d6937a" alt="tweetx-logo" />
          </h1>
        </div>
      </div>
      </>
  );
};

export default Header;
