'use client'

import { EventCount } from '@/lib/dal'
import useServer from '@/store/server'
import React, { useCallback, useEffect, useState } from 'react'
import { Spinner } from './ui/spinner'

function CountsTable({ counts, type, host, day }: { counts: EventCount[] | null, type: 'itms'|'ivms', host: string, day: string}) {
  const [countState, setCountState] = useState<EventCount[] | null>([])
  const { displayServerData, serverCounts } = useServer(state => state)

  const fetchCurrentHourData = useCallback(async () => {
    const date = new Date()
    const response = await fetch(`/event/api/${host}/${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}/${date.getHours().toString().padStart(2, '0')}/${type}`)
    if (response.ok) {
      const data: EventCount = await response.json()
      if (!data) return
      
      setCountState(prevState => prevState?.map((count: EventCount) => count.time_range === data.time_range ? {...count, event_count: data.event_count} : count) || null)
    }
  }, [host, type])

  useEffect(() => {
    setCountState(counts)
  }, [counts])

  useEffect(() => {
    let id = null

    if (day === 'live') {
      id = setInterval(fetchCurrentHourData, 5000)
    }

    return () => {
      if (id) {
        clearInterval(id)
      }
    }
  }, [fetchCurrentHourData, day])

  return (
    <div className="">
      <div className='h-[calc(100vh-200px)] overflow-y-auto mt-1'>
        <table className='w-full border border-muted-foreground/50'>
            <thead className='bg-sky-300 sticky top-0 z-10'>
                <tr>
                    <th className='border border-muted-foreground/50 text-sm py-1 px-3'>Time</th>
                    {
                      displayServerData && (
                        <th className='border border-muted-foreground/50 text-sm py-1 px-3 text-center'>API Count</th>
                      )
                    }
                    <th className='border border-muted-foreground/50 text-sm py-1 px-3 text-center'>Event Count</th>
                </tr>
            </thead>
            <tbody>
                {
                    countState?.map((count, index) => (
                        <tr key={index}>
                            <td className='border border-muted-foreground/50 text-sm py-1 px-3'>{count.time_range}</td>
                            {
                              displayServerData && (
                                <td className='border border-muted-foreground/50 text-sm py-1 px-3 text-right'>
                                  {
                                    serverCounts?.[count.time_range]?.[`${type}_event_count`] ?? (
                                      <Spinner className='ml-auto' />
                                    )
                                  }
                                </td>
                              )
                            }
                            <td className='border border-muted-foreground/50 text-sm py-1 px-3 text-right'>{count.event_count}</td>
                        </tr>
                    ))
                }
            </tbody>
            <tfoot className='bg-muted-foreground sticky bottom-0 z-10'>
                <tr>
                    <td className='border border-muted-foreground/50 text-sm font-bold text-background py-1 px-3'>Total</td>
                    {
                      displayServerData && (
                        <td className='border border-muted-foreground/50 text-sm font-bold text-background py-1 px-3 text-right'>{Object.values(serverCounts || {})?.reduce((sum, acc) => sum + (acc?.[`${type}_event_count`] || 0), 0) || 0}</td>
                      )
                    }
                    <td className='border border-muted-foreground/50 text-sm font-bold text-background py-1 px-3 text-right'>{countState?.reduce((sum, acc) => sum + parseInt(acc.event_count), 0) || 0}</td>
                </tr>
            </tfoot>
        </table>
      </div>

    </div>
  )
}

export default React.memo(CountsTable)