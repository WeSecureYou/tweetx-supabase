import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { setDoc, collection, getDoc, doc } from "firebase/firestore";
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
const userRef = collection(db, "userData");
export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user.uid);
      checkUserDataRecord(result.user.uid, result);
      console.log(result.user)
      // window.location.assign("/");
    })
    .catch((error) => {
      alert(error.message);
    });
};
async function pushUserInit(uid, data) {
  await setDoc(doc(db, "userData", uid), {
    followers: [],
    following: [],
    bookmarks: [],
    likes: [],
    retweets: [],
    uid: uid,
    displayName: data.user.displayName,
    email: data.user.email,
    photoURL: data.user.photoURL,
    userName: "",
    isVerified: false,
    isDev: false,
    isCompany: false,
    bannerURL: "",
    userDisliked: [],
  });
}
async function checkUserDataRecord(uid, data) {
  try {
    const userDocRef = doc(db, "userData", uid); // Create a DocumentReference using the uid
    const querySnapshot = await getDoc(userDocRef); // Use the DocumentReference in getDoc
    const document = querySnapshot.data();
    console.log("check user data record ==> ", querySnapshot.data());
    if (document) {
      console.log("USER RECORD EXISTS FOR ==>", uid);
    } else {
      console.log("CREATED USER RECORD FOR ==>", uid)
      pushUserInit(uid, data);
    }
  } catch (e) {
    console.log(e);
  }
}
export const logout = async () => {
  await signOut(auth);
  window.location.pathname = "/"
};
