import React from 'react'
import { IoMdCheckmarkCircleOutline } from "react-icons/io"

const DLconfirmation = () => {
    return (
        <div className="container h-[680px] overflow-hidden w-full px-2 flex flex-col justify-center pt-3 backdrop-blur-md bg-[#111827bb]">
            <div className="modalt flex flex-col items-center justify-center w-full h-max max-h-max border-none border-gray-800 rounded-xl py-6 px-1">
            <IoMdCheckmarkCircleOutline className='text-4xl text-green-500 mb-2' />
                <p className='text-md tracking-wide font-bold'>Post hidden successfully</p>
            </div>
        </div>
    )
}

export default DLconfirmation