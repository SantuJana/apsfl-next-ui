import CamerasTable from '@/components/cameras-table'
import { getSourceById } from '@/lib/dal'
import { notFound } from 'next/navigation'
import React from 'react'

async function ChannelList({ params, searchParams }: { params: Promise<{sourceId: string, serverType: string}>, searchParams: Promise<{day: string}>}) {
    const { sourceId, serverType } = await params
    const { day } = await searchParams

    const source = await getSourceById(sourceId)

    if (!source) return notFound()

  return (
    <div className='flex flex-col gap-2 '>
        <CamerasTable sourceId={sourceId} serverType={serverType} host={source.host} day={day || 'live'} />
    </div>
  )
}

export default ChannelList