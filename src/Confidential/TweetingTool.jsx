import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../Config/firebase-config';
import { fullDate } from '../Service/Service';
const TweetingTool = () => {
  const tweetCollectionRef = collection(db, "tweets")
  const [tweetInput, setTweetInput] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [currentSelectedAccount, setCurrentSelectedAccount] = useState()
  const [Vtype, setVtype] = useState("");
  // const companyLogo = "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg"
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };
  useEffect(() => {
    document.title = "Internal Tweeting Tool / TweetX"
    fetchUserRegistrar()
  }, [])
  const fetchUserRegistrar = async () => {
    const querySnapshot = await getDocs(collection(db, "userData"))
    setAccounts(
      querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    )
  }
  const fetchDetailsOfCurrentSelected = async (id) => {
    const querySnapshot = await getDoc(doc(db, "userData", id))
    setCurrentSelectedAccount(
      querySnapshot.data()
    )
    assureUserVerificationType(querySnapshot.data())
  }
  const assureUserVerificationType = (data) => {
    if (data.isVerified === true){
      setVtype("user")
    }
    else if (data.isDev === true){
      setVtype("dev")
    }
    else if (data.isCompany === true){
      setVtype("company")
    }
  }
  useEffect(() => {
    if (selectedAccount !== "") {
      fetchDetailsOfCurrentSelected(selectedAccount)
      console.log("fetched details of", selectedAccount)
    }
    else {
      console.log("chill out didn't fetch the profile yet")
    }
    }, [selectedAccount])

  const postToCompanyAccount = async () => {
    if (currentSelectedAccount){
    if (tweetInput !== "") {
      const currentTime = getCurrentTime();
      await addDoc(tweetCollectionRef, {
        text: tweetInput,
        image: tweetImage,
        comments: [],
        users_who_liked: [],
        users_who_retweeted: [],
        users_who_bookmarked: [],
        author_name: currentSelectedAccount.displayName,
        author_av: currentSelectedAccount.photoURL,
        author_username: currentSelectedAccount.userName ? currentSelectedAccount.userName : "",
        author_id: currentSelectedAccount.uid,
        OperatingSystem: "TweetX Internal Tweet Tool",
        planet: "Earth",
        specie: "Human",
        time: currentTime,
        date: fullDate,
        userId: "tweetx",
        verificationType: Vtype,
      })
      setTweetImage("");
      setTweetInput("");
      alert("Tweet has been posted to --> TweetX, Globally")
    }
    else {
      alert("Company account cannot have an empty tweet")
    }
  }else {
    alert("The account does not exists to which you are trying to post")
  }
  }
  return (
    <div className='flex flex-col'>
      <h1 className='text-2xl font-bold tracking-wide'>TweetX Internal Posting Tool</h1>
      <select
        name="accounts"
        id="accounts"
        className=" p-1 m-1 rounded-sm bg-gray-800 text-white max-w-max overflow-hidden text-xs mx-1 outline-none border-none py-2"
        onChange={(e) => setSelectedAccount(e.target.value)}
        defaultValue=""
        placeholder="Select an account"
      >
        <option value="">
          Select - {accounts.length} Account(s) Found
        </option>
        {accounts.map((user) => {
          return (
            <option value={user.id}>
              {user.displayName} • {user.email}
            </option>
          );
        })}
      </select>
      <input className='outline-none border-none p-1 m-1' type="text" value={tweetInput} onChange={(e) => setTweetInput(e.target.value)} placeholder='Tweet Text' />
      <input className='outline-none border-none p-1 m-1' type="text" value={tweetImage} onChange={(e) => setTweetImage(e.target.value)} placeholder='Tweet Image' />
      <button className='bg-blue-500 text-white rounded-md w-max py-1 px-3 m-1' onClick={() => postToCompanyAccount()}>Post Globally</button>
    </div>
  )
}

export default TweetingTool