import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import HeaderAlt from "./HeaderAlt";
const EditProfileRedo = ({ username, onClose }) => {
  const [userData, setUserData] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  const [message, setMessage] = useState("");
  const [type, setType] = useState("null");

  useEffect(() => {
    fetchUserProfile(username);
  }, [username]);

  const fetchUserProfile = async (username) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", username)
        .single();
      if (error) throw error;
      if (data !== null) {
        setUserData(data);
        // setUpdatedFields(data); // Initialize updatedFields with user data
        console.log(userData)
        console.log(updatedFields)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    console.log(`Received input for the field ${fieldName} with the following value: ${value}`)
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };

  const checkUsernameAvailability = async (query) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", query)
        .maybeSingle();
      if (error) throw error;
      if (data !== null) {
        setType("bad")
        setMessage(`The username "${query}" is already taken`)
      }
      else if (data === null) {
        setType("good")
        setMessage(`The username "${query}" is available`)
      }
      else {
        setType("null")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateUserProfile = async () => {
    try {
      console.log("updating records with the following value:", updatedFields)
      await supabase
        .from("profiles")
        .update(updatedFields)
        .eq("id", username);
      fetchUserProfile(username); // Fetch updated data after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // const handleUserNameChange = (e) => {
  //   handleFieldChange("userName", e.target.value)
  //   if (e.target.value !== ""){
  //     checkUsernameAvailability(e.target.value)
  //   }
  //   else {
  //     setMessage(false)
  //   }
  // }
  return (
    <div className="fixed h-screen top-0 z-50 w-full flex flex-col bg-gray-900 w-full overflow-hidden">
      <HeaderAlt page={"Edit Profile"} />
      <div className="bg-blue-400 h-28">
        {userData?.bannerURL ? (
          <img
            src={userData?.bannerURL}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="p-1">
        <div className="flex flex-col relative items-center space-x-4">
          <div className="w-full h-max flex flex-row justify-between items-center">
            {userData?.photoURL ?
              <img
                src={userData?.photoURL}
                alt="Avatar"
                className="w-24 h-24 left-3 top-[-45px] absolute rounded-full border-4 border-gray-900"
              /> :
              <img
                src="https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
                alt="Avatar"
                className="w-24 h-24 left-3 top-[-45px] absolute rounded-full border-4 border-gray-900"
              />
            }
          </div>
        </div>
      </div>

      <div className="px-2 py-2 flex flex-col mt-14">
        <div className="flex px-2 flex-col my-2 w-full">
          <label htmlFor="banner" className="font-bold flex flex-col text-gray-300 w-max max-w-full">
            Banner <span className="text-xs font-light text-gray-400 overflow-hidden max-w-1/2">(current - {userData.bannerURL})</span>
          </label>
          <input
            className="py-1 px-2 border-gray-800 border rounded-md text-sm bg-transparent text-blue-400 w-full outline-none"
            type="text"
            name="banner"
            placeholder="Enter your banner URL"
            value={
              updatedFields.bannerURL
            }
            onChange={(e) => handleFieldChange("bannerURL", e.target.value)}
          />
        </div>
        <div className="flex px-2 flex-col my-2 w-full">
            <label htmlFor="banner" className="font-bold flex flex-col text-gray-300 w-max max-w-full">
            Avatar <span className="text-xs font-light text-gray-400 overflow-hidden max-w-1/2">(current - {userData.photoURL})</span>
          </label>
          <input
            type="text"
            name="Avatar"
            placeholder="Enter your avatar URL"
            className="py-1 px-2 border-gray-800 border rounded-md text-sm bg-transparent text-blue-400 w-full outline-none"
            value={updatedFields.photoURL}
            onChange={(e) => handleFieldChange("photoURL", e.target.value)}
          />
        </div>
        <div className="flex px-2 flex-col my-2 w-full">
        <label htmlFor="banner" className="font-bold flex flex-col text-gray-300 w-max max-w-full">
            Display Name <span className="text-xs font-light text-gray-400 overflow-hidden max-w-1/2">(current - {userData.displayName})</span>
          </label>
          <input
            type="text"
            name="displayName"
            placeholder="Enter your Name"
            className="py-1 px-2 border-gray-800 border rounded-md text-sm bg-transparent text-blue-400 w-full outline-none"
            value={updatedFields.displayName}
            onChange={(e) => handleFieldChange("displayName", e.target.value)}
          />
        </div>
        <div className="flex px-2 flex-col my-2 w-full">
            <label htmlFor="banner" className="font-bold flex flex-col text-gray-300 w-max max-w-full">
            Username <span className="text-xs font-light text-gray-400 overflow-hidden max-w-1/2">(current - {userData.id})</span>
          </label>
          <input
            type="text"
            name="displayName"
            placeholder="Enter your Username"
            className="py-1 px-2 border-gray-800 border rounded-md text-sm bg-transparent text-blue-400 w-full outline-none"
            value={updatedFields.userName}
            onChange={(e) => handleFieldChange("id", e.target.value)}
          />
          <p className={`${type === "good" ? "text-green-400" : null} ${type === "bad" ? "text-red-400" : null} overflow-hidden max-w-max font-md text-xs ml-1 mt-1`}>
            {message !== "" ? (
              message
            ) : null}</p>
        </div>
        <div className="flex flex-row px-2 my-4">
          <button
            className="px-3 py-[6px] rounded-lg text-white text-xs bg-blue-600 font-semibold tracking-wide"
            onClick={updateUserProfile}>Update Profile</button>
          <button
            className="px-3 py-[6px] rounded-lg text-white text-xs bg-blue-600 font-semibold tracking-wide ml-2"
            onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileRedo;
