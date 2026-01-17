import EditSourceForm from '@/components/edit-source-form'
import { Button } from '@/components/ui/button'
import { getSourceById } from '@/lib/dal'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

async function EditDataSource({ params }: { params: Promise<{sourceId: string}> }) {
    const { sourceId } = await params

    const source = await getSourceById(sourceId)

    if (!source) {
        notFound()
    }
    
  return (
    <div className='h-full flex justify-center items-center relative'>
        <div className='absolute top-0 start-0'>
            <Link href={'/'}>
                <Button variant={'outline'} className='cursor-pointer text-sky-600'>
                    <ArrowLeft />
                    Back
                </Button>
            </Link>
        </div>
        <div className='max-w-sm w-full'>
            <EditSourceForm source={source} />
        </div>
    </div>
  )
}

export default EditDataSource