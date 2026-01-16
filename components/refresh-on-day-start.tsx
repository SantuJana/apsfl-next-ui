'use client'

import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'

function RefreshOnDayStart() {
    const router = useRouter()

    const setRefresh = useCallback(() => {
        const now = new Date()
        const tomorrow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 6
        )
        
        const diffInMill = tomorrow.getTime() - now.getTime()
        const id = setTimeout(() => {router.refresh()}, diffInMill)

        return id
    }, [])

    useEffect(() => {
        const id: any = setRefresh()

        return () => clearTimeout(id)
    }, [])

  return (
    <></>
  )
}

export default React.memo(RefreshOnDayStart)