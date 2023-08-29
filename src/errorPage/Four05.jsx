import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header';
const Four05 = () => {
  const navigate = useNavigate();
  return (
    <>
    <Header/>
    <div className="container mx-auto h-[90vh] w-full flex flex-col items-center justify-center">
    <div className='font-bold tracking-wider text-xl'>Error 405 / Not Allowed</div>
    <button className='bg-blue-600 px-3 text-sm py-1 mt-2 rounded-md' onClick={() => navigate("/")}>Go back home</button>
    </div>
    </>
  )
}

export default Four05