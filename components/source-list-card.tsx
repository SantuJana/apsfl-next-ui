'use client'

import React, { useCallback, useMemo } from 'react'
import { Card, CardContent } from './ui/card'
import { Source } from '@/lib/dal'
import { usePathname, useRouter } from 'next/navigation'
import SourceActions from './source-actions'

function SourceListCard({ source }: { source: Source }) {
    const pathname = usePathname()
    const router = useRouter()

    const selected = useMemo(() => pathname === `/${source.id}`, [pathname])

    const handleRedirect = useCallback((e: React.MouseEvent<HTMLSpanElement, MouseEvent>, type: 'itms'|'ivms') => {
        e.stopPropagation()
        router.push(`/${source.id}/${type}`)
    }, [source.id])

  return (
    <div onClick={(e) => selected ? e.preventDefault() : router.push(`/${source.id}`)}>
        <Card className={`p-2 cursor-pointer ${selected ? 'cursor-not-allowed bg-sky-100' : !source.enabled ? 'bg-red-100' : ''}`}>
            <CardContent className='p-2'>
                <div className='h-20cursor-pointer'>
                    <div className='flex gap-2 justify-between items-baseline'>
                        <h3 className='text-sm font-medium capitalize'>{source.name}</h3>
                        {
                            !selected && (
                                <SourceActions source={source} />
                            )
                        }
                    </div>
                    <p className='text-xs'>{source.host}</p>
                    <p className='text-xs'>
                        {
                            !!source.itms && (
                                <span className='hover:text-sky-600 hover:underline underline-offset-2 hover:cursor-pointer' onClick={(e) => handleRedirect(e, 'itms')}>ITMS</span>
                            )
                        }
                        {
                            !!source.itms && !!source.ivms && (" - ")
                        }
                        {
                            !!source.ivms && (
                                <span className='hover:text-sky-600 hover:underline underline-offset-2 hover:cursor-pointer' onClick={(e) => handleRedirect(e, 'ivms')}>IVMS</span>
                            )
                        }
                        {
                            !!source.broker && ` | ${source.broker.toUpperCase()}`
                        }
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default SourceListCard