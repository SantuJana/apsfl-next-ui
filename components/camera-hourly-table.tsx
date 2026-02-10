'use client'

import { CameraHourlyData } from '@/lib/dal';
import DaySelect from '@/components/day-select'
import RefreshButton from '@/components/refresh-btn'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Loader from './loader';
import { ArrowLeft, CircleX, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function CameraHourlyTable({ sourceId, channelId, uuid, ip, serverType, host, day }: { sourceId: string, channelId: string, ip: string, uuid: string, serverType: string, host: string, day: string }) {
    const [isPending, setIsPending] = useState<boolean>(true);
    const [downloadProcessing, setDownloadProcessing] = useState<boolean>(false)
    const [hourlyData, setHourlyData] = useState<CameraHourlyData[] | null>(null)
    const router = useRouter()

    const dayObj: any = {
        'live': 0,
        'yesterday': 1,
        'day-before-yesterday': 2
    }

    const fetchData = useCallback(async (sourceId: string, channelId: string, serverType: string, day: string) => {
        setIsPending(true)
        try {
            const now = new Date()
            const dayStartEpoch = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - (dayObj[day] || 0),
                0, 0, 0, 0
            ).getTime()

            const response = await fetch(`/${sourceId}/${serverType}/${channelId}/api?dayStartEpoch=${dayStartEpoch}`)
            if (response.ok) {
                const data = await response.json()
                setHourlyData(data)
            }
        } catch (error) {
            setHourlyData(null)
        } finally {
            setIsPending(false)
        }
    }, [])

    const exportToCSV = useCallback(() => {
        if (!hourlyData?.length) return
        setDownloadProcessing(true)

        try {
            const headers = ['Time', 'Avg FPS', 'Avg Bitrate']
            let csvRows = [
                headers.join(','),
                ...hourlyData.map((row, index) =>
                    `"${String(row.time_range ?? '').replace(/"/g, '""')}","${String(row.avgrecfps ?? '').replace(/"/g, '""')}","${String(row.avgrecbitrate ?? '').replace(/"/g, '""')}"`)
            ]
    
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
    
            const a = document.createElement('a')
            a.href = url
            const now = new Date()
            a.download = `${uuid}_${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.csv`
            a.click()
    
            URL.revokeObjectURL(url)
        } catch (error) {
            
        } finally {
            setDownloadProcessing(false)
        }
    }, [hourlyData, uuid])

    
    useEffect(() => {
        fetchData(sourceId, channelId, serverType, day)
    }, [sourceId, channelId, serverType, day])

  return (
    <>
        <div className='flex items-center'>
            <DaySelect />
            <p className='mx-auto font-bold'>{host} - {serverType.toUpperCase()}</p>
            <Button variant={'outline'} disabled={downloadProcessing} className={`bg-green-200 mr-2 cursor-pointer hover:bg-green-300 ${downloadProcessing ? 'animate-pulse' : ''}`} onClick={exportToCSV}>
                <FileSpreadsheet className='animate-pulse' />
                CSV
            </Button>
            <span onClick={(e) => { e.stopPropagation(); fetchData(sourceId, channelId, serverType, day)}}>
                <RefreshButton />
            </span>
        </div>
        <div className='p-2 bg-muted-foreground/50 flex items-center justify-center relative'>
            <div className='flex items-center gap-1 absolute start-2 hover:cursor-pointer' onClick={() => router.back()}>
                <ArrowLeft className='h-4 w-4' />
                Back
            </div>
            <div>{uuid} ({ip})</div>
            {/* <div></div> */}
        </div>
        <div className='rounded-sm border overflow-hidden h-[calc(100vh-190px)] overflow-y-auto'>
            <table className='w-full h-full text-sm'>
                <thead className='bg-sky-600 text-background sticky z-10 top-0'>
                    <tr>
                        <th className='border border-muted-foreground p-1 py-2'>Time</th>
                        <th className='border border-muted-foreground p-1 py-2'>Avg FPS</th>
                        <th className='border border-muted-foreground p-1 py-2'>Avg Bitrate</th>
                    </tr>
                </thead>
                {
                    isPending ? (
                        <tbody>
                            <tr>
                                <td colSpan={3}>
                                    <Loader text='Loading Camera Counts' />
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {
                                !!hourlyData && !!hourlyData.length ? (
                                    hourlyData.map((data, index) => (
                                        <tr key={index} >
                                            <td className='border border-muted-foreground p-1 px-2'>{data.time_range}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{data.avgrecfps}</td>
                                            <td className='border border-muted-foreground p-1 px-2'>{data.avgrecbitrate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className='text-center' colSpan={3}>No Record Found</td>
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

export default CameraHourlyTable