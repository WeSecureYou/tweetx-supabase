import React, { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../Config/firebase-config'
const VerificationSystem = () => {
    const collectionRef = collection(db, "userData")
    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState("");
    useEffect(() => {
        fetchUserRegistrar();
            document.title = "Account Verification System / TweetX"
    }, [])
    async function fetchUserRegistrar() {
        const querySnapshot = await getDocs(collectionRef);
        setUserData(
            querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
        )
    }
    async function changeUserVerificationStat(type) {
        if (userId !== null) {
            if (type === "user") {
                await updateDoc(doc(db, "userData", userId), {
                    isVerified: true,
                    isDev: false,
                    isCompany: false
                })
                alert("User Verified")
            }
            else if (type === "dev") {
                await updateDoc(doc(db, "userData", userId), {
                    isDev: true,
                    isVerified: false,
                    isCompany: false
                })
                alert("Developer Verified")
            }
            else if (type === "company") {
                await updateDoc(doc(db, "userData", userId), {
                    isCompany: true,
                    isVerified: false,
                    isDev: false
                })
                alert("Comapny Verified")
            }
            else {
                //DO NOTHING
            }
        }
        else {
            alert("Select an account")
        }

    }
    return (
        <div className='flex flex-col'>
            <h1 className='text-2xl font-bold tracking-wide m-1'>TweetX User Verification System</h1>
            <select
                name="userdata"
                id="userdata"
                className=" p-1 mt-1 rounded-sm bg-gray-800 text-white max-w-max overflow-hidden text-xs mx-1 outline-none border-none py-2"
                onChange={(e) => setUserId(e.target.value)}
                defaultValue=""
                placeholder="Select an account"
            >
                <option value="">
                    Select - {userData.length} Account(s) Found
                </option>
                {userData.map((user) => {
                    return (
                        <option value={user.id} className="max-w-full">
                            {user.displayName} - Followers: {user.followers.length} - Following: {user.following.length}
                        </option>
                    );
                })}
            </select>
            <div className='flex flex-row py-2'>
            <button onClick={() => changeUserVerificationStat("user")} className='w-max m-1 py-1 px-3 bg-blue-500 rounded-md'>Verify User</button>
            <button onClick={() => changeUserVerificationStat("dev")} className='w-max m-1 py-1 px-3 bg-blue-500 rounded-md'>Verify Developer</button>
            <button onClick={() => changeUserVerificationStat("company")} className='w-max m-1 py-1 px-3 bg-blue-500 rounded-md'>Verify Company</button>
            </div>
        </div>
    )
}

export default VerificationSystem