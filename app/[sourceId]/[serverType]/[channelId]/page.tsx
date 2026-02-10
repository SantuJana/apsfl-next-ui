import CameraHourlyTable from '@/components/camera-hourly-table'
import { getChannelById, getSourceById } from '@/lib/dal'
import { notFound } from 'next/navigation'
import React from 'react'

async function ChannelHourlyPage({ params, searchParams }: { params: Promise<{sourceId: string, serverType: string, channelId: string}>, searchParams: Promise<{day: string}>}) {
    const { sourceId, serverType, channelId } = await params
    const { day } = await searchParams

    const source = await getSourceById(sourceId)

    if (!source) return notFound()

    const channel = await getChannelById(channelId)

    if (!channel) return notFound()
    
  return (
    <div className='flex flex-col gap-2 '>
      <CameraHourlyTable sourceId={sourceId} channelId={channelId} uuid={channel.uuid} ip={channel.channelip} serverType={serverType} host={source.host} day={day || 'live'} />
    </div>
  )
}

export default ChannelHourlyPage