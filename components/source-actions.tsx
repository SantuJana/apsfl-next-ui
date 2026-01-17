import { Source } from '@/lib/dal'
import React from 'react'
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu'
import { EllipsisVertical, EllipsisVerticalIcon } from 'lucide-react'
import Form from 'next/form'
import { deleteSource, toggleSourceStatus } from '@/actions/source'
import { Button } from './ui/button'
import Link from 'next/link'

function SourceActions({ source }: { source: Source }) {
  return (
    <div onClick={(e) => e.stopPropagation()} className='z-20'>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className='text-sm font-normal h-4 w-4 cursor-pointer' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Link href={`/edit-data-source/${source.id}`} >
                    <DropdownMenuItem className='cursor-pointer'>Edit</DropdownMenuItem>
                </Link>
                <Form action={toggleSourceStatus.bind(null, source.id)}>
                    <button className='w-full'>
                        <DropdownMenuItem className='cursor-pointer'>{source.enabled ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
                    </button>
                </Form>
                <Form action={deleteSource.bind(null, source.id)}>
                    <button className='w-full'>
                        <DropdownMenuItem className='bg-red-50 text-red-500 cursor-pointer hover:!bg-red-100 hover:!text-red-500'>
                            Delete
                        </DropdownMenuItem>
                    </button>
                </Form>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default SourceActions

{/* <Form action={deleteSource.bind(null, source.id)}>
    <Button variant={'outline'} size={'icon-sm'} className='cursor-pointer' disabled={selected}>
        <Trash2 className='h-4 w-4 shrink-0' />
    </Button>
</Form> */}