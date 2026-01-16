import React from 'react'
import Loader from './loader'

function EventsFallback({ type }: { type: string }) {
  return (
    <div className=''>
        <Loader text={type == 'itms' ? 'Loading ITMS Events' : 'Loading IVMS Events'} />
    </div>
  )
}

export default EventsFallback