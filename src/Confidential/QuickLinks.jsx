import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
const QuickLinks = () => {
    const navigate = useNavigate();
    useEffect(() => {
      document.title = "Admin v1.1 / TweetX"
    }, [])
  return (
    <div className='flex flex-col'>
        <h1 className='m-1 text-2xl font-bold tracking-wide'>Admin v1.1</h1>
        <div className='flex flex-col md:flex-row py-1'>
          <div className="flex flex-row">
        <button className='w-max bg-blue-700 py-1 px-3 m-1 rounded-md' onClick={() => navigate("/tools/admin/tweeting-tool")}>Internal Tweeting Tool</button>
        <button className='w-max bg-blue-700 py-1 px-3 m-1 rounded-md' onClick={() => navigate("/tools/admin/create-account")}>Create Account</button>
          </div>
          <div className="flex flex-row">
        <button className='w-max bg-blue-700 py-1 px-3 m-1 rounded-md' onClick={() => navigate("/tools/admin/verification-tool")}>Verification System</button>
        <button className='w-max bg-blue-700 py-1 px-3 m-1 rounded-md' onClick={() => navigate("/tools/admin/admin-panel")}>Data Registrar</button>
          </div>
          <div className="flex flex-row">
        <button className='w-max bg-blue-700 py-1 px-3 m-1 rounded-md' onClick={() => navigate("/tools/admin/data-transfer")}>Data Transfer</button>
          </div>
        </div>
    </div>
  )
}

export default QuickLinks