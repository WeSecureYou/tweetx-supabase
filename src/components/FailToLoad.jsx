import React from 'react'

const FailToLoad = () => {
    return (
        <div className="container flex flex-col h-screen w-full items-center justify-center bg-gray-900 absolute top-0 z-50">
            <img
                className="h-16 w-16"
                src="https://firebasestorage.googleapis.com/v0/b/tweetx-385019.appspot.com/o/X-logo-removebg-preview.png?alt=media&token=a66d7461-a768-41d9-9a33-4a5b18d6937a"
                alt="loading_gif"
            />
            <p className='text-xs font-bold tracking-wide text-gray-600'>Uh Oh! There was an error while fetching the tweets.</p>
        </div>
    )
}

export default FailToLoad