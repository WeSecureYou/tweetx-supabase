import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { supabase } from "../supabaseClient";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "tweetx-385019.firebaseapp.com",
  projectId: "tweetx-385019",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "447435682629",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-SE5TQQR5FB",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in with Google:", result.user.uid);
    
    // Fetch user record or create if not exists
    await queryUserRegistrar(result.user.uid, result);
    
    console.log("Data sent to subsequent functions");
  } catch (error) {
    alert(error.message);
  }
};

const generateUsername = (name) => {
  const username = name.replace(" ", "_");
  return username;
};

async function createUserRecord(id, chunk, userName) {
  try {
    const { error } = await supabase.from("userRegistrar").insert(
      {
        id: id,
        followers: [],
        following: [],
        bookmarks: [],
        likes: [],
        reposts: [],
        userDisliked: [],
        uid: chunk.user.uid,
        displayName: chunk.user.displayName,
        email: chunk.user.email,
        photoURL: chunk.user.photoURL,
        verificationType: "",
        userName: userName,
        bannerURL: "",
      },
    );
    console.log("Created user record successfully");
    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function createUserProfile(userName, chunk) {
  try {
    const { error } = await supabase.from("profiles").insert(
      {
        id: userName,
        followers: [],
        following: [],
        bookmarks: [],
        likes: [],
        reposts: [],
        userDisliked: [],
        uid: chunk.user.uid,
        displayName: chunk.user.displayName,
        email: chunk.user.email,
        photoURL: chunk.user.photoURL,
        verificationType: "",
        userName: userName,
        bannerURL: "",
      },
    );
    console.log("Created user profile successfully");
    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function queryUserProfile(userName, chunk) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userName)
      .maybeSingle()
    
      console.log(data)
    if (error) throw error;
    
    if (data === null) {
      console.log("Creating user profile for", userName);
      await createUserProfile(userName, chunk);
    } else {
      console.log("User profile exists for", userName);
    }
  } catch (error) {
    console.log(error);
  }
}

async function queryUserRegistrar(id, chunk) {
  try {
    const { data, error } = await supabase
      .from("userRegistrar")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      
    if (error) throw error;

    if (data === null) {
      const userName = generateUsername(chunk.user.displayName);
      console.log("Creating user record & querying user profile");
      
      // Create user record and then query user profile
      await createUserRecord(id, chunk, userName);
      await queryUserProfile(userName, chunk);
    } else {
      console.log("Querying user profile because record exists for", id);
      
      // Query user profile directly
      await queryUserProfile(data.userName, chunk);
    }
  } catch (error) {
    console.log(error);
  }
}
export const logout = async () => {
  await signOut(auth);
};
