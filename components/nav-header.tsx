import Link from 'next/link'
import React from 'react'

function NavHeader() {
  return (
    <div className='h-15 shrink-0 bg-sky-600 flex items-center justify-between px-5'>
        <h1 className='text-xl text-white font-bold'>
            <Link href={'/'}>Api Server Logs</Link>
        </h1>
        <div>
            <ul className='flex gap-3 items-center'>
                <li className='text-white font-medium underline-offset-2 hover:underline hover:cursor-pointer'>
                    <Link href={'/log'}>Logs</Link>
                </li>
                {/* <li className='text-white font-medium underline-offset-2 hover:underline hover:cursor-pointer'>Fetch Historical Data</li> */}
                <li className='text-white font-medium underline-offset-2 hover:underline hover:cursor-pointer'>
                    <Link href={'/add-data-source'}>Add Data Source</Link>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default NavHeader