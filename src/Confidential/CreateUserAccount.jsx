import React, {useState, useEffect} from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../Config/firebase-config'
const CreateUserAccount = () => {
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [banner, setBanner] = useState("");
    const [uid, setUid] = useState("");
    useEffect(() => {
        document.title = "Create User Account / TweetX"
      }, [])
    const forceCreateAccount = async() => {
        if (userName, name, avatar, uid !== ""){
            await setDoc(doc(db, "userData", uid), {
                followers: [],
                following: [],
                bookmarks: [],
                likes: [],
                retweets: [],
                uid: uid,
                displayName: name,
                email: "",
                photoURL: avatar,
                userName: userName,
                isVerified: false,
                isDev: false,
                isCompany: false,
                bannerURL: banner ? banner : "",
                userDisliked: [],
            })
            alert("Account has been created on TweetX")
            setAvatar("")
            setBanner("")
            setName("")
            setUid("")
            setUserName("");
        }
        else {
            alert("All fields are required to create account on TweetX")
        }
    }
  return (
    <div className='flex flex-col'>
        <h1 className='text-2xl font-bold tracking-wide'>TweetX Account Creation Tool</h1>
        <input className='outline-none border-none p-1 m-1' type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Username' />
        <input className='outline-none border-none p-1 m-1' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Account Name' />
        <input className='outline-none border-none p-1 m-1' type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder='Avatar' />
        <input className='outline-none border-none p-1 m-1' type="text" value={banner} onChange={(e) => setBanner(e.target.value)} placeholder='Banner' />
        <input className='outline-none border-none p-1 m-1' type="text" value={uid} onChange={(e) => setUid(e.target.value)} placeholder='UID' />
        <button className='w-max bg-blue-500 py-1 px-3 m-1 rounded-md' onClick={() => forceCreateAccount()}>Create Account</button>
    </div>
  )
}

export default CreateUserAccount