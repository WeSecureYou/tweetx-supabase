import React, { useState, useEffect } from 'react';
import { db } from "../Config/DatabaseReworked";
import { getDoc, doc } from 'firebase/firestore';
import { signInWithGoogle } from "../Config/DatabaseReworked";
import { FcGoogle } from "react-icons/fc";

const CreateAccount = () => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [dob, setDob] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("null");
    const logo = "https://firebasestorage.googleapis.com/v0/b/tweetx-385019.appspot.com/o/X-logo-removebg-preview.png?alt=media&token=a66d7461-a768-41d9-9a33-4a5b18d6937a";
    const lookupUsername = async (id) => {
        if (username !== "") {
            const querySnapshot = await getDoc(doc(db, "profiles", id))
            if (querySnapshot.exists()) {
                setType("bad")
                setMessage(`The username "${id}" is already taken`)
                return false
            }
            else {
                setType("good")
                setMessage("")
                return true
            }
        } else {
            setType("null")
            setMessage("Nigga write something first")
        }
    }

    const handleNextStep = async() => {
        if (step === 1 && username !== "") {
            const isUsernameAvailable = await lookupUsername(username);
            if (isUsernameAvailable === true) {
                setStep(step + 1);
            }
        } else if (step === 2 && displayName !== "" && type === "good") {
            // Additional validation for step 2 if needed

            setStep(step + 1)
        } else if (step === 3 && dob !== "") {
            // Additional validation for step 3 if needed
            //Take in all the data i.e username, displayName, dob and create account in firebase using email and passwrod
            console.log(dob)
        }
        console.log(dob)
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col px-5 mt-10">
                        <label htmlFor="username" className='font-bold ml-1 text-sm'>Username</label>
                        <input name="username" placeholder='Please enter your username' id="username" className="text-xs px-2 focus:border focus:border-blue-400 focus:text-blue-400 outline-none bg-transparent border-gray-800 flex flex-row items-center w-full rounded-[999px] bg-blue-400 py-3 justify-center text-white text-sm font-bold tracking-wide" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <p className={`${type === "good" ? "text-green-400" : null} ${type === "bad" ? "text-red-400" : null} font-semibold text-xs ml-1 mt-1`}>
                            {message !== "" ? (
                            message
                        ): null}</p>
                        <button className="w-full flex flex-row items-center justify-center bg-transparent border border-blue-400 text-blue-400 px-4 py-2 mt-3 rounded-full font-bold" onClick={handleNextStep}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col px-5 mt-10">
                        <label htmlFor="displayName" className='font-bold ml-1 text-sm'>Display Name</label>
                        <input name="displayName" placeholder='Please enter your display name' id="displayName" className="text-xs px-2 focus:border focus:border-blue-400 focus:text-blue-400 outline-none bg-transparent border-gray-800 flex flex-row items-center w-full rounded-[999px] bg-blue-400 py-3 justify-center text-white text-sm font-bold tracking-wide" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        <div className='w-full flex flex-row'>
                        <button className="w-1/2 flex flex-row items-center justify-center bg-transparent border mx-1 border-blue-400 text-blue-400 px-4 py-2 mt-3 rounded-full font-bold" onClick={() => setStep(step - 1)}>Go Back</button>
                        <button className="w-full flex flex-row items-center justify-center bg-transparent border mx-1 border-blue-400 text-blue-400 px-4 py-2 mt-3 rounded-full font-bold" onClick={handleNextStep}>Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col px-5 mt-10">
                        <label htmlFor="dob" className='font-bold ml-1 text-sm'>Date of birth</label>
                        <input name="dob" type='date' placeholder='Please enter your date of birth' id="dob" className="text-xs px-2 focus:border focus:border-blue-400 focus:text-blue-400 outline-none bg-transparent border-gray-800 flex flex-row items-center w-full rounded-[999px] bg-blue-400 py-3 justify-center text-white text-sm font-bold tracking-wide" value={dob} onChange={(e) => setDob(e.target.value)} />
                        <div className='w-full flex flex-row'>
                        <button className="w-1/2 flex flex-row items-center justify-center bg-transparent border mx-1 border-blue-400 text-blue-400 px-4 py-2 mt-3 rounded-full font-bold" onClick={() => setStep(step - 1)}>Go Back</button>
                        <button className="w-full flex flex-row items-center justify-center bg-transparent border mx-1 border-blue-400 text-blue-400 px-4 py-2 mt-3 rounded-full font-bold">Submit</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="h-screen w-full bg-gray-900 fixed top-0 z-10 flex flex-col">
                <div className="flex flex-row items-start py-2 px-1">
                    <img src={logo} alt="login_logo" className="w-36 h-36 mt-1" />
                </div>
                <div className="flex flex-row w-full items-start px-5 mt-1">
                    <h1 className="secondary-font text-lg font-black tracking-wide">Create Account ({step}/3)</h1>
                </div>
                {renderStepContent()}
                <div className="flex items-center justify-between mt-4 px-5">
                    <span className="w-full border-b border-gray-600 lg:w-1/5"></span>
                    <p className="w-max px-4">or</p>
                    <span className="w-full border-b border-gray-600 lg:w-1/5"></span>
                </div>
                <div className="flex flex-col px-5 mt-2">
                    <div className="flex flex-row items-center w-full rounded-[999px] bg-white py-3 justify-center text-black text-sm font-semibold tracking-wide"
                        onClick={() => signInWithGoogle()}
                    >
                        <FcGoogle className="text-xl mr-1" />
                        Sign up with Google
                    </div>
                </div>
                <div className="flex flex-row px-5 text-gray-500 mt-2 ml-1">
                    <p className="text-xs">
                        By signing up, you agree with to the <span className="text-blue-500">Terms of Service</span> and <span className="text-blue-500">Privacy Policy</span> including <span className="text-blue-500">Cookie use.</span>
                    </p>
                </div>
                <div className="mt-12 px-5 flex flex-col">
                    <h3 className="text-lg font-semibold tracking-wide">Already have an account?</h3>
                    <div className="mt-2 flex flex-row items-center w-full rounded-[999px] bg-transparent py-3 justify-center text-blue-400 border border-gray-600 text-sm font-bold tracking-wide">
                        Sign in
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAccount;
