import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
const EditProfileModal = ({ username, onClose }) => {
  const [userData, setUserData] = useState();
  const [updatedFields, setUpdatedFields] = useState({});
  useEffect(() => {
    fetchUserProfile(username);
  }, []);
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFieldChange = (fieldName, value) => {
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };

  const updateUserProfile = async () => {
    try {
      const { error } = await supabase.from("profiles").update({
        id: username,
        ...updatedFields,
      }).eq("id", username);
      if (error) throw error;
      window.location.reload()
      console.log("updated profile");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute h-screen top-0 z-50 w-full flex flex-col bg-gray-800 w-full overflow-hidden">
      <input
        type="text"
        placeholder="banner"
        value={updatedFields.bannerURL || ""}
        onChange={(e) => handleFieldChange("bannerURL", e.target.value)}
      />
      <input
        type="text"
        placeholder="av"
        value={updatedFields.photoURL || ""}
        onChange={(e) => handleFieldChange("photoURL", e.target.value)}
      />
      <input
        type="text"
        placeholder="name"
        value={updatedFields.displayName || ""}
        onChange={(e) => handleFieldChange("displayName", e.target.value)}
      />
      <button onClick={updateUserProfile}>Update Profile</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EditProfileModal;
