import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header';
const PostNotFound = () => {
    const navigate = useNavigate()
    useEffect(() => {
        document.title = "Error 404 / Post Not Found"
    }, [])
  return (
    <>
    <Header/>
    <div className="container mx-auto h-[90vh] w-full flex flex-col items-center justify-center">
    <div className='font-black tracking-wide'>
      <h1 className='text-xl'>
      Error 404 / Post not found
      </h1>
      </div>
    <div className='px-2 text-center w-full'>
    <p className='text-sm text-gray-500'>The post you have been looking for is either deleted or does not exist.</p>
    </div>
    <button className='bg-blue-600 px-3 text-sm py-1 mt-4 rounded-md' onClick={() => navigate("/")}>Go back home</button>
    </div>
    </>
  )
}

export default PostNotFound