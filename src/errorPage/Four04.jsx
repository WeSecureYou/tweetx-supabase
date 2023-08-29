import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header';
const Four04 = () => {
  useEffect(() => {
    document.title = "Error 404 / File Not Found"
}, [])
  const navigate = useNavigate();
  return (
    <>
    <Header/>
    <div className="container mx-auto h-[90vh] w-full flex flex-col items-center justify-center">
    <div className='font-bold tracking-wider text-xl'>Error 404 / File not found</div>
    <button className='bg-blue-600 px-3 text-sm py-1 mt-2 rounded-md' onClick={() => navigate("/")}>Go back home</button>
    </div>
    </>
  )
}

export default Four04