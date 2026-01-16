import AddSourceForm from '@/components/add-source-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function AddDataSourcePage() {
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
            <AddSourceForm />
        </div>
    </div>
  )
}

export default AddDataSourcePage