import React, { Suspense } from 'react'
import SourceList from './source-list'
import Loader from './loader'

function Sidebar() {

  return (
    <div className='max-w-xs w-full shrink-0 border-r-2 bg-muted flex flex-col'>
        <div className='p-2 border-b-1 shrink-0'>
            Data Sources
        </div>
        <div className='flex-1 overflow-y-auto'>
            <Suspense fallback={<FallBackUI />}>
                <SourceList />
            </Suspense>
        </div>
    </div>
  )
}

function FallBackUI() {
    return (
        <div className='h-full w-full flex justify-center items-center'>
            <Loader text='Loading Data Sources' />
        </div>
    )
}

export default Sidebar