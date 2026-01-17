'use client'

import React, { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

function RefreshButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh()
        })
    }

  return (
    <Button className='z-10 bg-sky-600 hover:bg-sky-500 ms-auto cursor-pointer' onClick={handleRefresh} disabled={isPending}>
        <RefreshCcw className={isPending ? 'animate-spin' : ''}/>
        Refresh
    </Button>
  )
}

export default RefreshButton