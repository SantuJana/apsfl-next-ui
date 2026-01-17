'use client'

import { CameraWiseCount } from '@/lib/dal';
import DaySelect from '@/components/day-select'
import RefreshButton from '@/components/refresh-btn'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Loader from './loader';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group';
import { CircleX } from 'lucide-react';

function CameraWiseCountTable({ sourceId, host, day }: { sourceId: string, host: string, day: string }) {
    const [isPending, setIsPending] = useState<boolean>(true);
    const [cameraWiseCount, setCameraWiseCount] = useState<CameraWiseCount[] | null>(null)
    const [filteredCameraWiseCount, setFilteredCameraWiseCount] = useState<CameraWiseCount[] | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const timeoutId = useRef<ReturnType<typeof setTimeout>>(null)

    const dayObj: any = {
        'live': 0,
        'yesterday': 1,
        'day-before-yesterday': 2
    }

    const removeTimeout = () => {
        if (!!timeoutId.current) {
            clearTimeout(timeoutId.current)
            timeoutId.current = null
        }
    }

    const doSearch = useCallback((searchText: string) => {
        setFilteredCameraWiseCount(() => cameraWiseCount?.filter(count => 
            count.servername.toLowerCase().includes(searchText) ||
            count.channelname.toLowerCase().includes(searchText) ||
            count.servertype.toLowerCase().includes(searchText)
        ) || [])
    }, [cameraWiseCount])

    const fetchCount = useCallback(async (sourceId: string) => {
        setIsPending(true)
        try {
            const now = new Date()
            const dayStartEpoch = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - (dayObj[day] || 0),
                0, 0, 0, 0
            ).getTime()
            const response = await fetch(`/${sourceId}/camera-wise-count/api?dayStartEpoch=${dayStartEpoch}`)
            if (response.ok) {
                const data = await response.json()
                setCameraWiseCount(data)
            }
        } catch (error) {
            setCameraWiseCount(null)
        } finally {
            setIsPending(false)
        }
    }, [])
    
    useEffect(() => {
        
        fetchCount(sourceId)
    }, [sourceId, day])

    useEffect(() => {
        if (!searchText) {
            setFilteredCameraWiseCount(cameraWiseCount)
        } else {
            removeTimeout()
            timeoutId.current = setTimeout(() => doSearch(searchText), 500)
        }

        return () => removeTimeout()
    }, [searchText, cameraWiseCount])

  return (
    <>
        <div className='flex items-center'>
            <DaySelect />
            <p className='mx-auto font-bold'>{host}</p>
            <InputGroup className='w-70 mr-5'>
                <InputGroupInput placeholder="Search here..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <InputGroupAddon align="inline-end">
                {
                    !!searchText && (
                        <InputGroupButton
                            className='cursor-pointer'
                            aria-label="Copy"
                            title="Copy"
                            size="icon-xs"
                            onClick={() => {
                                setSearchText('')
                            }}
                        >
                            <CircleX /> 
                        </InputGroupButton>
                    )
                }
                </InputGroupAddon>
            </InputGroup>
            <span onClick={(e) => { e.stopPropagation(); fetchCount(sourceId)}}>
                <RefreshButton />
            </span>
        </div>
        <div className='rounded-sm border overflow-hidden h-[calc(100vh-150px)] overflow-y-auto'>
            <table className='w-full h-full text-sm'>
                <thead className='bg-sky-600 text-background sticky z-10 top-0'>
                    <tr>
                        <th className='border border-muted-foreground p-1 py-2'>SL No</th>
                        <th className='border border-muted-foreground p-1 py-2'>Server Name</th>
                        <th className='border border-muted-foreground p-1 py-2'>Server Type</th>
                        <th className='border border-muted-foreground p-1 py-2'>Channel Name</th>
                        <th className='border border-muted-foreground p-1 py-2'>Channel Event Count</th>
                    </tr>
                </thead>
                {
                    isPending ? (
                        <tbody>
                            <tr>
                                <td colSpan={5}>
                                    <Loader text='Loading Camera Counts' />
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {
                                !!filteredCameraWiseCount && !!filteredCameraWiseCount.length ? (
                                    filteredCameraWiseCount.map((count, index) => (
                                        <tr key={`${count.serverid}-${count.channelid}`}>
                                            <td className='border border-muted-foreground p-1 px-2'>{index + 1}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>&lt;ID: {count.serverid}&gt; {count.servername}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{count.servertype}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>&lt;ID: {count.channelid}&gt; {count.channelname}</td>
                                            <td className='border border-muted-foreground p-1 px-2 text-end'>{count.event_count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className='text-center' colSpan={5}>No Record Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    )
                }
                <tfoot className='sticky z-10 bottom-0'>
                    <tr className='font-semibold bg-muted-foreground text-background'>
                        <td className='border border-muted-foreground p-1 px-2' colSpan={4}>Total</td>
                        <td className='border border-muted-foreground p-1 px-2 text-end'>{filteredCameraWiseCount?.reduce((sum, count) => sum + Number(count.event_count), 0) || 0}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </>
  )
}

export default CameraWiseCountTable