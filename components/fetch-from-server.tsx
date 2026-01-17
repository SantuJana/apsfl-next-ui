'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useServer from '@/store/server'
import { useSearchParams } from 'next/navigation'

export type Source = {
    id: string,
    name: string,
    host: string,
    port: number,
    enabled: boolean,
    protocol: string,
    itms: boolean,
    ivms: boolean
}

function FetchFromServer({ source }: { source: Source }) {
    const searchParams = useSearchParams()
    const day = searchParams.get('day') || 'live'
    const [checked, setChecked] = useState<boolean>(false)
    const abortController = useRef<AbortController | null>(null)
    const intervalId = useRef<ReturnType<typeof setTimeout>>(null)

    const { setDisplayServerData, pushCount, reset } = useServer(state => state)

    const dayObj: any = {
      'live': 0,
      'yesterday': 1,
      'day-before-yesterday': 2
    }

    const removeInterval = useCallback(() => {
        if (!!intervalId.current) {
            clearInterval(intervalId.current)
            intervalId.current = null
        }
    }, [])

    const fetchServerCount = useCallback(async (host: string, port: number, start: number, end: number, current: boolean = false) => {
        try {
            const response = await fetch(`/server-data/api?host=${host}&port=${port}&start=${start}&end=${end}`, { signal: abortController.current?.signal })

            if (response.ok) {
                const data: any = (await response.json())?.result?.[0]
                
                if (!!data) {
                    pushCount({
                        itms_event_count: data.tmsEventCount,
                        ivms_event_count: data.vmsEventCount,
                        time_range: `${new Date(start).getHours().toString().padStart(2, '0')}:${new Date(start).getMinutes().toString().padStart(2, '0')}-${new Date(end).getHours().toString().padStart(2, '0')}:59`
                    })
                }
            }
        } catch (error) {
            
        }
    }, [])

    const startCurrentHourServerCountInterval = useCallback(() => {
        removeInterval()
        intervalId.current = setInterval(() => {
            const now = new Date();
            const startOfHour = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                now.getHours(),
                0, 0, 0
            );
            const endOfHour = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                now.getHours(),
                59, 59, 999
            );

            fetchServerCount(source.host, source.port, startOfHour.getTime(), endOfHour.getTime(), true)
        }, 5000)
    }, [source.host, source.port])

    const fetchEventCounts = useCallback(async (host: string, port: number) => {
        const now = new Date();

        // start of today (local time)
        const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - dayObj[day],
            0, 0, 0, 0
        );

        // end of today
        const endOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - dayObj[day],
            23, 59, 59, 999
        );

        for (
            let current = new Date(startOfDay);
            current <= endOfDay;
            current.setHours(current.getHours() + 1)
        ) {
            const start = new Date(current);

            const end = new Date(current);
            end.setMinutes(59, 59, 999);

            fetchServerCount(host, port, start.getTime(), end.getTime())
        }

        if (day === 'live') startCurrentHourServerCountInterval()
    }, [day])

    useEffect(() => {
        if (checked) {
            abortController.current = new AbortController()
            fetchEventCounts(source.host, source.port)
        } else {
            reset()
        }

        return () => {
            abortController.current?.abort()
            removeInterval()
        }
    }, [checked, source, fetchEventCounts])

    useEffect(() => {
        return () => setDisplayServerData(false)
    }, [])

  return (
    <div className='flex flex-row gap-2 items-center ml-auto'>
        <Label>Fetch From API</Label>
        <Checkbox
            checked={checked}
            onCheckedChange={(e) => {setChecked(e as boolean); setDisplayServerData(e as boolean)}}
            className="
                data-[state=checked]:bg-sky-600
                data-[state=checked]:border-sky-600
                data-[state=checked]:text-white
            "
        />
    </div>
  )
}

export default FetchFromServer