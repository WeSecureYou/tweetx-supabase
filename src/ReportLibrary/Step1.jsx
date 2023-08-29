import React from 'react'

const Step1 = ({ next }) => {
    return (
        <div className='flex flex-col items-center h-full overflow-hidden'>
            <div className='mt-4 flex flex-row items-start w-full'>
                <img className="h-28 w-28 cursor-pointer" src="https://firebasestorage.googleapis.com/v0/b/tweetx-385019.appspot.com/o/X-logo-removebg-preview.png?alt=media&token=a66d7461-a768-41d9-9a33-4a5b18d6937a" alt="tweetx-logo" />
            </div>
            <div className='secondary-font text-2xl font-bold tracking-wide w-full items-start flex flex-row mt-2 pl-4'>
                Hello
            </div>
            <div className='flex flex-row flex-wrap w-full max-w-full text-gray-500 text-sm px-4 font-semibold'>
                <p className='py-2'>
                    We need you to answer a few questions so we can better
                    understand what's going on in this account's profile or
                    Posts. You'll also have the option to add more info in
                    your own words and add Posts to this report.
                </p>
                <p className='py-4'>
                    We take reports seriously. If we find a rule violation, we'll
                    either ask them to remove the content or lock or suspend
                    the account.
                </p>
                <p className='py-3'>
                    If there's immediate danger, call your local emergency
                    services in addition to reporting.
                </p>
            </div>
            <div className='mt-4 w-full px-4'>
                <button className='py-3 px-4 w-full rounded-full bg-white text-gray-900 text-sm font-semibold' onClick={() => next()}>
                    Start report
                </button>
            </div>
        </div>
    )
}

export default Step1