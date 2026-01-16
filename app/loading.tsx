import Loader from '@/components/loader'
import React from 'react'

function RootLoading() {
  return (
    <div className='h-full w-full flex justify-center items-center'>
        <Loader text='Loading Source Data' size='large' />
    </div>
  )
}

export default RootLoading