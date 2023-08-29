import React, { useEffect, useState } from 'react'
import { db } from "../Config/firebase-config"
import { getDocs, collection, doc, getDoc, setDoc } from 'firebase/firestore'
const DataTransfer = () => {
    const oldDbRef = collection(db, "userData")
    const [oldDbFetched, setOldDbFetched] = useState([])
    const [id, setId] = useState("");
    const [oldDocument, setOldDocument] = useState()
    useEffect(() => {
        fetchOldDb()
    }, [])
    useEffect(() => {
        if (id !== "") {
            fetchSpecificDocOldDb(id)
        }
        else {
            console.log("chill")
        }
    }, [id])
    const fetchOldDb = async () => {
        const querySnapshot = await getDocs(oldDbRef)
        setOldDbFetched(
            querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
        )
    }
    const fetchSpecificDocOldDb = async(id) => {
            console.log("fetched old doc for", id)
            const querySnapshot = await getDoc(doc(db, "userData", id))
            setOldDocument(querySnapshot.data());
    }
    const transferDataToNewDb = async (oldDocument) => {
        let userName
        if (oldDocument.userName !== "") {
            userName = oldDocument.userName
        }
        else {
            userName = oldDocument.displayName.replace(" ", "_")
            console.log(userName)
        }
        await setDoc(doc(db, "profiles", userName), {
            followers: oldDocument.followers,
            following: oldDocument.following,
            bookmarks: oldDocument.bookmarks,
            likes: oldDocument.likes,
            retweets: oldDocument.retweets,
            userDisliked: oldDocument.userDisliked ? oldDocument.userDisliked : [],
            uid: oldDocument.uid,
            displayName: oldDocument.displayName,
            email: oldDocument.email ? oldDocument.email : null,
            photoURL: oldDocument.photoURL,
            isVerified: oldDocument.isVerified,
            isDev: oldDocument.isDev ? oldDocument.isDev : null,
            isCompany: oldDocument.isCompany,
            userName: oldDocument.userName,
            bannerURL: oldDocument.bannerURL,
        })
        console.log("data transfered to new db for document", id)
    }
    return (
        <div>
            <p className="text-xl font-bold tracking-wide uppercase ml-1 mt-1">Old Database Record(s)</p>
            <select
                name="tweets"
                id="tweets"
                className=" px-1 mt-1 rounded-md bg-gray-800 text-white max-w-max overflow-hidden text-xs mx-1 outline-none border-none py-2"
                onChange={(e) => setId(e.target.value)}
                defaultValue=""
                placeholder="Select a document"
            >
                <option value="">
                    Select - {oldDbFetched.length} Records(s) Found
                </option>
                {oldDbFetched.map((document) => {
                    return (
                        <option value={document.id} className="max-w-full">
                            {document.displayName}
                        </option>
                    );
                })}
            </select>
            <button onClick={() => transferDataToNewDb(oldDocument)}
                className="px-3 ml-1 py-[7px] w-max flex flex-row items-center mt-2 rounded-md text-white text-xs bg-blue-600 font-semibold tracking-wide"
            >
                Start Transfer
            </button>
        </div>
    )
}

export default DataTransfer