import React from 'react'
import { MdVerified } from "react-icons/md"

const VerificationInfoModal = ({ type, onClose }) => {
    return (
        <div className='w-full py-4 fixed bottom-0 h-[185px] border-t-2 border-gray-800 bg-gray-900 rounded-t-2xl rounded-r-2xl z-50 slide-in'>
            {/* <div className='w-full flex flex-row justify-center items-center mb-4'>
                <div className='w-[40px] h-[5px] bg-gray-700 rounded-full'></div>
            </div> */}
            <div className='px-3 pb-2'>
                <h1 className='text-xl text-white font-bold'>Verified Account</h1>
            </div>
            <div className='pb-1'>
                {type === "user" ? (
                    <>
                        <div className='flex flex-row items-start w-full px-2 py-2'>
                            <MdVerified className='text-blue-500 text-xl' />
                            <p className='text-gray-600 font-semibold text-sm mt-[-1px] ml-1'>This account is verified because it has an notable identity.</p>
                        </div>
                    </>
                ) : null}
                {type === "dev" ? (
                    <>
                        <div className='flex flex-row items-start w-full px-2 py-2'>
                            <MdVerified className='text-yellow-500 text-xl' />
                            <p className='text-gray-600 font-semibold text-sm mt-[-1px] ml-1'>This account appears to be verified developer on TweetX.</p>
                        </div>
                    </>
                ) : null}
                {type === "company" ? (
                    <>
                        <div className='flex flex-row items-start w-full px-2 py-2'>
                            <MdVerified className='text-yellow-500 text-xl' />
                            <p className='text-gray-600 font-semibold text-sm mt-[-1px] ml-1'>This account appears to be offical company account on TweetX.</p>
                        </div>
                    </>
                ) : null}
            </div>
            <div className='px-2 pb-2'>
                <button className="mt-2 flex flex-row items-center w-full rounded-[999px] bg-transparent py-3 justify-center text-blue-400 border border-blue-400 text-sm font-bold tracking-wide"
                    onClick={() => onClose()}
                >
                    Got it
                </button>
            </div>
        </div>
    )
}
// VerificationInfoModal.defaultProps = {
//     type: "dev",
// }
export default VerificationInfoModal