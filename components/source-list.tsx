import { getSources } from '@/lib/dal'
import Link from 'next/link'
import React, { use } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Trash2 } from 'lucide-react'
import Form from 'next/form'
import { deleteSource } from '@/actions/source'
import SourceListCard from './source-list-card'

function SourceList() {
    const sources = use(getSources())

    if (!sources || !sources.length) {
        return (
            <div className='p-2 flex flex-col justify-center items-center'>
                <h3>No Data Source Found</h3>
                <Link href={'/add-data-source'}>
                    <Button className='bg-sky-600 cursor-pointer hover:bg-sky-500'>
                        Add Your First Data Source Now
                    </Button>
                </Link>
            </div>
        )
    }

  return (
    <div className='h-full p-2 overflow-y-scroll flex flex-col gap-2'>
        {
            sources.map((source, index) => {
                return (
                    <SourceListCard key={source.id} source={source} />
                )
            })
        }
    </div>
  )
}

export default SourceList