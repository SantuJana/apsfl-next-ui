'use client'

import { Cameras } from '@/lib/dal';
import DaySelect from '@/components/day-select'
import RefreshButton from '@/components/refresh-btn'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Loader from './loader';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group';
import { CircleX, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function CamerasTable({ sourceId, serverType, host, day }: { sourceId: string, serverType: string, host: string, day: string }) {
    const [isPending, setIsPending] = useState<boolean>(true);
    const [downloadProcessing, setDownloadProcessing] = useState<boolean>(false)
    const [cameras, setCameras] = useState<Cameras[] | null>(null)
    const [filteredCameras, setFilteredCameras] = useState<Cameras[] | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const timeoutId = useRef<ReturnType<typeof setTimeout>>(null)
    const router = useRouter()

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
        setFilteredCameras(() => cameras?.filter(camera => 
            camera.servername.toLowerCase().includes(searchText.toLowerCase()) ||
            camera.channelname.toLowerCase().includes(searchText.toLowerCase()) ||
            camera.uuid.toLowerCase().includes(searchText.toLowerCase()) ||
            camera.channelip.toLowerCase().includes(searchText.toLowerCase())
        ) || [])
    }, [cameras])

    const fetchCount = useCallback(async (sourceId: string, serverType: string, day: string) => {
        setIsPending(true)
        try {
            const now = new Date()
            const dayStartEpoch = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - (dayObj[day] || 0),
                0, 0, 0, 0
            ).getTime()
            const response = await fetch(`/${sourceId}/${serverType}/api?dayStartEpoch=${dayStartEpoch}`)
            if (response.ok) {
                const data = await response.json()
                setCameras(data)
            }
        } catch (error) {
            setCameras(null)
        } finally {
            setIsPending(false)
        }
    }, [])

    const exportToCSV = useCallback(() => {
        if (!filteredCameras?.length) return
        setDownloadProcessing(true)

        try {
            const headers = ['SL No', 'UUID', 'Server Name', 'Channel IP', 'Channel Name', 'Avg FPS', 'Avg Bitrate']
            let csvRows = [
                headers.join(','),
                ...filteredCameras.map((row, index) =>
                    `"${String((index + 1)).replace(/"/g, '""')}","${String(row.uuid ?? '').replace(/"/g, '""')}","${String(row.servername ?? '').replace(/"/g, '""')}","${String(row.channelip ?? '').replace(/"/g, '""')}","${String(row.channelname ?? '').replace(/"/g, '""')}","${String(row.avgrecfps ?? '').replace(/"/g, '""')}","${String(row.avgrecbitrate ?? '').replace(/"/g, '""')}"`)
            ]
    
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
    
            const a = document.createElement('a')
            a.href = url
            const now = new Date()
            a.download = `${host}_${serverType}_${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.csv`
            a.click()
    
            URL.revokeObjectURL(url)
        } catch (error) {
            
        } finally {
            setDownloadProcessing(false)
        }
    }, [filteredCameras, host, serverType])

    const handleRedirect = useCallback((channelId: string, day: string) => {
        router.push(`/${sourceId}/${serverType}/${channelId}?day=${day}`)
    }, [sourceId, serverType])

    
    useEffect(() => {
        fetchCount(sourceId, serverType, day)
    }, [sourceId, serverType, day])

    useEffect(() => {
        if (!searchText) {
            setFilteredCameras(cameras)
        } else {
            removeTimeout()
            timeoutId.current = setTimeout(() => doSearch(searchText), 500)
        }

        return () => removeTimeout()
    }, [searchText, cameras])

  return (
    <>
        <div className='flex items-center'>
            <DaySelect />
            <p className='mx-auto font-bold'>{host} - {serverType.toUpperCase()}</p>
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
            <Button variant={'outline'} disabled={downloadProcessing} className={`bg-green-200 mr-2 cursor-pointer hover:bg-green-300 ${downloadProcessing ? 'animate-pulse' : ''}`} onClick={exportToCSV}>
                <FileSpreadsheet className='animate-pulse' />
                CSV
            </Button>
            <span onClick={(e) => { e.stopPropagation(); fetchCount(sourceId, serverType, day)}}>
                <RefreshButton />
            </span>
        </div>
        <div className='rounded-sm border overflow-hidden max-h-[calc(100vh-150px)] overflow-y-auto'>
            <table className='w-full h-full text-sm'>
                <thead className='bg-sky-600 text-background sticky z-10 top-0'>
                    <tr>
                        <th className='border border-muted-foreground p-1 py-2'>SL No</th>
                        <th className='border border-muted-foreground p-1 py-2'>UUID</th>
                        <th className='border border-muted-foreground p-1 py-2'>Server Name</th>
                        <th className='border border-muted-foreground p-1 py-2'>Channel IP</th>
                        <th className='border border-muted-foreground p-1 py-2'>Channel Name</th>
                        <th className='border border-muted-foreground p-1 py-2'>Avg FPS</th>
                        <th className='border border-muted-foreground p-1 py-2'>Avg Bitrate</th>
                    </tr>
                </thead>
                {
                    isPending ? (
                        <tbody>
                            <tr>
                                <td colSpan={7}>
                                    <Loader text='Loading Camera Counts' />
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {
                                !!filteredCameras && !!filteredCameras.length ? (
                                    filteredCameras.map((camera, index) => (
                                        <tr key={camera.channelid} className='hover:cursor-pointer hover:bg-sky-100' onClick={() => handleRedirect(camera.dbchannelid, day)}>
                                            <td className='border border-muted-foreground p-1 px-2'>{index + 1}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{camera.uuid}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{camera.servername}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{camera.channelip}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{camera.channelname}</td>
                                            <td className='border border-muted-foreground p-1 px-2 text-end'>{camera.avgrecfps}</td>
                                            <td className='border border-muted-foreground p-1 px-2 text-end'>{camera.avgrecbitrate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className='text-center' colSpan={7}>No Record Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    )
                }
            </table>
        </div>
    </>
  )
}

export default CamerasTable