import React from 'react'

const Step3 = ({prev, next}) => {
  return (
    <>
      <div className='flex flex-col items-center h-full overflow-hidden'>
        <div className='mt-4 flex flex-row items-start w-full'>
          <img className="h-28 w-28 cursor-pointer" src="https://firebasestorage.googleapis.com/v0/b/tweetx-385019.appspot.com/o/X-logo-removebg-preview.png?alt=media&token=a66d7461-a768-41d9-9a33-4a5b18d6937a" alt="tweetx-logo" />
        </div>
        <div className='secondary-font text-xl font-bold tracking-wide w-full items-start flex flex-row mt-2 pl-4'>
          Step 3 ?
        </div>
        <div className='flex flex-col w-full max-w-full text-white text-md px-4 py-2 font-md'>
        </div>
        <div className='mt-4 w-full px-4'>
          <button className='py-3 px-4 w-half rounded-full bg-white text-gray-900 text-sm font-semibold' onClick={() => prev()}>
            Go Back
          </button>
          <button className='py-3 mx-4 px-4 w-half rounded-full bg-white text-gray-900 text-sm font-semibold' onClick={() => next()}>
            Next
          </button>
        </div>
      </div>
    </>
  )
}

export default Step3