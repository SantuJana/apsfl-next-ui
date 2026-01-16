import DaySelect from '@/components/day-select'
import FetchFromServer from '@/components/fetch-from-server'
import TMSEvents from '@/components/tms-events'
import VMSEvents from '@/components/vms-events'
import { getSourceById } from '@/lib/dal'
import React from 'react'

async function SourcePage({ params, searchParams }: { params: Promise<{sourceId: string}>, searchParams: Promise<{day: string | undefined}> }) {
    const { sourceId } = await params
    const { day } = await searchParams

    const source = await getSourceById(sourceId)

    if (!source) {
      return (
        <h1>Selected Source Not Found</h1>
      )
    }

  return (
    <div className="max-h-full overflow-x-scroll relative">
      <div className="bg-muted-foreground text-background p-2 grid grid-cols-3 items-center">
        <div>
          <DaySelect />
        </div>
        <h2 className="font-bold mx-auto">API Server {source?.host || ''}</h2>
        <FetchFromServer source={source} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <VMSEvents host={source.host} day={day || 'live'} />
        <TMSEvents host={source.host} day={day || 'live'} />
      </div>
    </div>
  )
}

export default SourcePage