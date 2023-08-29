import React from 'react'
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';
const HeaderAlt = ({ page }) => {
    const navigate = useNavigate();
    return (
        <div className="h-max bg-gray-900 py-3 text-white w-full flex flex-row border-b border-gray-800 z-10">
            <div className="w-full justify-center flex flex-row">
                <button
                    onClick={() => navigate("/")}
                    className="ml-2 text-lg mb-[-20px] absolute left-0"
                >
                    <BiArrowBack />
                </button>
                <h1 className="text-sm font-bold tracking-wide">
                    {page}
                </h1>
            </div>
        </div>
    )
}

export default HeaderAlt