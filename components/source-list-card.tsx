'use client'

import React, { useMemo } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Trash2 } from 'lucide-react'
import Form from 'next/form'
import { deleteSource } from '@/actions/source'
import { Source } from '@/lib/dal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SourceActions from './source-actions'

function SourceListCard({ source }: { source: Source }) {
    const pathname = usePathname();

    const selected = useMemo(() => pathname === `/${source.id}`, [pathname])
    // const selected = useMemo(() => pathname.split('/').reverse()[0] === source.id, [pathname])


  return (
    <Link href={`/${source.id}`} onClick={(e) => selected && e.preventDefault()}>
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
                                'ITMS'
                            )
                        }
                        {
                            !!source.itms && !!source.ivms && (" - ")
                        }
                        {
                            !!source.ivms && (
                                'IVMS'
                            )
                        }
                        {
                            !!source.broker && ` | ${source.broker.toUpperCase()}`
                        }
                    </p>
                </div>
            </CardContent>
        </Card>
    </Link>
  )
}

export default SourceListCard