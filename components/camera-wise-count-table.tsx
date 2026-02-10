'use client'

import { CameraWiseCount } from '@/lib/dal';
import DaySelect from '@/components/day-select'
import RefreshButton from '@/components/refresh-btn'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Loader from './loader';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group';
import { CircleX, FileSpreadsheet, ListFilter } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';

function CameraWiseCountTable({ sourceId, host, day }: { sourceId: string, host: string, day: string }) {
    const [isPending, setIsPending] = useState<boolean>(true);
    const [downloadProcessing, setDownloadProcessing] = useState<boolean>(false)
    const [cameraWiseCount, setCameraWiseCount] = useState<CameraWiseCount[] | null>(null)
    const [filteredServerTypeCameraWiseCount, setFilteredServerTypeCameraWiseCount] = useState<CameraWiseCount[] | null>(null)
    const [filteredCameraWiseCount, setFilteredCameraWiseCount] = useState<CameraWiseCount[] | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const timeoutId = useRef<ReturnType<typeof setTimeout>>(null)
    const [serverType, setServerType] = useState<string>('all')

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
        setFilteredCameraWiseCount(() => filteredServerTypeCameraWiseCount?.filter(count => 
            count.servername.toLowerCase().includes(searchText.toLowerCase()) ||
            count.channelname.toLowerCase().includes(searchText.toLowerCase()) ||
            count.servertype.toLowerCase().includes(searchText.toLowerCase()) ||
            `${count.servername}_${count.channelid}`.toLowerCase().includes(searchText.toLowerCase())
        ) || [])
    }, [filteredServerTypeCameraWiseCount])

    const fetchCount = useCallback(async (sourceId: string, day: string) => {
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

    const exportToCSV = useCallback(() => {
        if (!filteredCameraWiseCount?.length) return
        setDownloadProcessing(true)

        try {
            const headers = ['SL No', 'UUID', 'Server Name', 'Server Type', 'Channel Name', 'Channel Event Count']
            let csvRows = [
                headers.join(','),
                ...filteredCameraWiseCount.map((row, index) =>
                    `"${String((index + 1)).replace(/"/g, '""')}","${String((row.servername+'_'+row.channelid)).replace(/"/g, '""')}","${String(row.servername ?? '').replace(/"/g, '""')}","${String(row.servertype ?? '').replace(/"/g, '""')}","${String(row.channelname ?? '').replace(/"/g, '""')}","${String(row.event_count ?? '').replace(/"/g, '""')}"`)
            ]
            const totalCount = filteredCameraWiseCount?.reduce((sum, count) => sum + Number(count.event_count), 0) || 0

            csvRows.push(`"","","","Total","${String((totalCount)).replace(/"/g, '""')}"`)
    
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
    
            const a = document.createElement('a')
            a.href = url
            const now = new Date()
            a.download = `${host}_${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.csv`
            a.click()
    
            URL.revokeObjectURL(url)
        } catch (error) {
            
        } finally {
            setDownloadProcessing(false)
        }
    }, [filteredCameraWiseCount, host])

    
    useEffect(() => {
        fetchCount(sourceId, day)
    }, [sourceId, day])

    useEffect(() => {
        setFilteredServerTypeCameraWiseCount(cameraWiseCount?.filter(camera => serverType === 'all' || camera.servertype.toLowerCase() === serverType) || null)
    }, [serverType, cameraWiseCount])

    useEffect(() => {
        if (!searchText) {
            setFilteredCameraWiseCount(filteredServerTypeCameraWiseCount)
        } else {
            removeTimeout()
            timeoutId.current = setTimeout(() => doSearch(searchText), 500)
        }

        return () => removeTimeout()
    }, [searchText, filteredServerTypeCameraWiseCount])

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
            <Button variant={'outline'} disabled={downloadProcessing} className={`bg-green-200 mr-2 cursor-pointer hover:bg-green-300 ${downloadProcessing ? 'animate-pulse' : ''}`} onClick={exportToCSV}>
                <FileSpreadsheet className='animate-pulse' />
                CSV
            </Button>
            <span onClick={(e) => { e.stopPropagation(); fetchCount(sourceId, day)}}>
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
                        <th className='border border-muted-foreground p-1 py-2 relative'>
                            <div className='flex items-center justify-between gap-1'>
                                Server Type
                                <div className='relative'>
                                    {
                                        serverType !== 'all' && (
                                            <div className='bg-red-500 h-2 w-2 rounded-full absolute -end-1' />
                                        )
                                    }
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <ListFilter className='h-4 w-4' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem className={serverType === 'all' ? 'bg-muted-foreground/50' : ''} onClick={() => setServerType('all')}>All</DropdownMenuItem>
                                            <DropdownMenuItem className={serverType === 'itms' ? 'bg-muted-foreground/50' : ''} onClick={() => setServerType('itms')}>ITMS</DropdownMenuItem>
                                            <DropdownMenuItem className={serverType === 'ivms' ? 'bg-muted-foreground/50' : ''} onClick={() => setServerType('ivms')}>IVMS</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </th>
                        <th className='border border-muted-foreground p-1 py-2'>Channel Name</th>
                        <th className='border border-muted-foreground p-1 py-2'>Channel Event Count</th>
                    </tr>
                </thead>
                {
                    isPending ? (
                        <tbody>
                            <tr>
                                <td colSpan={6}>
                                    <Loader text='Loading Camera Counts' />
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {
                                !!filteredCameraWiseCount && !!filteredCameraWiseCount.length ? (
                                    filteredCameraWiseCount.map((count, index) => (
                                        <tr key={`${count.serverid}-${count.channelid}-${count.servertype}`}>
                                            <td className='border border-muted-foreground p-1 px-2'>{index + 1}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{count.servername}_{count.channelid}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{count.servername}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{count.servertype}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{count.channelname}</td>
                                            <td className='border border-muted-foreground p-1 px-2 text-end'>{count.event_count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className='text-center' colSpan={6}>No Record Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    )
                }
                <tfoot className='sticky z-10 bottom-0'>
                    <tr className='font-semibold bg-muted-foreground text-background'>
                        <td className='border border-muted-foreground p-1 px-2' colSpan={5}>Total</td>
                        <td className='border border-muted-foreground p-1 px-2 text-end'>{filteredCameraWiseCount?.reduce((sum, count) => sum + Number(count.event_count), 0) || 0}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </>
  )
}

export default CameraWiseCountTable