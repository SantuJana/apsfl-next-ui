'use client'

import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import {  } from 'next/router'
import Loader from './loader'

type SelectValue = 'live' | 'yesterday' | 'day-before-yesterday'

function DaySelect() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const selected = searchParams.get('day') || 'live' as SelectValue | undefined
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const handleRedirect = (val: string) => {
        startTransition(() => {
            router.push(`${pathname}?day=${val}`)
        })
    }

  return (
    <>
        <Select value={selected} onValueChange={handleRedirect}>
            <SelectTrigger className="w-[200px] !h-6">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Counts</SelectLabel>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="day-before-yesterday">Day Before Yesterday</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        {
            isPending && (
                <div className='absolute top-0 start-0 h-full w-full z-20 pointer-events-none flex justify-center items-center'>
                    <Loader size='large' text='Refreshing Counts' className='text-sky-600 bg-background p-2' />
                </div>
            )
        }
    </>
  )
}

export default DaySelect