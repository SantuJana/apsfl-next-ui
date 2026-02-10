'use client'

import { EventCount } from '@/lib/dal'
import useServer from '@/store/server'
import React, { use, useCallback, useEffect, useState } from 'react'
import { Spinner } from './ui/spinner'
import Loader from './loader'

function CountsTable({ type, host, day, sourceId }: { type: 'itms'|'ivms', host: string, day: string, sourceId: string}) {
  const [isPending, setIsPending] = useState<boolean>(true)
  const [countState, setCountState] = useState<EventCount[] | null>([])
  const { displayServerData, serverCounts } = useServer(state => state)

  const dayObj: any = {
    'live': 0,
    'yesterday': 1,
    'day-before-yesterday': 2
  }

  const fetchCounts = async (sourceId: string, host: string, dayStartEpoch: number, type: string) => {
    setIsPending(true)
    try {
      const response = await fetch(`/${sourceId}/api?dayStartEpoch=${dayStartEpoch}&type=${type}`)

      if (!response.ok) return null

      const data = await response.json() as EventCount[]
      setCountState(data)
    } catch (error) {
    } finally {
      setIsPending(false)
    }
  }

  useEffect(() => {
    const now = new Date()
    const dayStartEpoch = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - (dayObj[day] || 0),
        0, 0, 0, 0
    ).getTime()
    
    fetchCounts(sourceId, host, dayStartEpoch, type)
  }, [sourceId, host, type])

  const fetchCurrentHourData = useCallback(async () => {
    const now = new Date()
    const hourStartEpoch = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        0, 0, 0
    ).getTime()
    const time_range = `${now.getHours().toString().padStart(2, '0')}:00-${now.getHours().toString().padStart(2, '0')}:59`

    const response = await fetch(`/event/api/hourly/${sourceId}/${hourStartEpoch}/${type}`)
    if (response.ok) {
      const data: EventCount = await response.json()
      if (!data) return
      
      setCountState(prevState => prevState?.map((count: EventCount) => count.time_range === time_range ? {...count, event_count: data.event_count} : count) || null)
    }
  }, [sourceId, type])

  useEffect(() => {
    if (isPending) return
    let id = null

    if (day === 'live') {
      id = setInterval(fetchCurrentHourData, 5000)
    }

    return () => {
      if (id) {
        clearInterval(id)
      }
    }
  }, [fetchCurrentHourData, day, isPending])

  return (
    <div className="">
      <div className='h-[calc(100vh-200px)] overflow-y-auto mt-1'>
        <table className='w-full h-full border border-muted-foreground/50'>
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
            {
              isPending ? (
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <Loader text={`Loading ${type.toUpperCase()} Data`} />
                    </td>
                  </tr>
                </tbody>
              ) : (
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
              )
            }
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