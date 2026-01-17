import React, { Suspense, use } from 'react'
import CountsTable from './counts-table';

function VMSEvents({ host, day, sourceId }: { host: string, day: string, sourceId: string }) {
  
  return (
    <div>
        <div className="bg-muted-foreground/50 text-background text-center p-2">
            <h2 className="text-foreground text-sm font-medium">VMS Event Count</h2>
        </div>
        <CountsTable type={'ivms'} host={host} day={day} sourceId={sourceId} />
    </div>
  )
}

export default VMSEvents