import CameraWiseCountTable from '@/components/camera-wise-count-table'
import { getSourceById } from '@/lib/dal'
import { notFound } from 'next/navigation'
import React from 'react'

async function CameraWiseCount({ params, searchParams }: { params: Promise<{sourceId: string}>, searchParams: Promise<{day: string}>}) {
    const { sourceId } = await params
    const { day } = await searchParams

    const source = await getSourceById(sourceId)

    if (!source) {
        notFound()
    }

    

    

  return (
    <div className='flex flex-col gap-2'>
        <CameraWiseCountTable sourceId={sourceId} day={day || 'live'} host={source.host} />
    </div>
  )
}

export default CameraWiseCount