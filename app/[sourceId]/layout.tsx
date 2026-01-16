import RefreshOnDayStart from '@/components/refresh-on-day-start'
import React from 'react'

function SourceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <RefreshOnDayStart />
        { children }
    </>
  )
}

export default SourceLayout