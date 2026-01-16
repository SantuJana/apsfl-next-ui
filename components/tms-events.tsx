import React from 'react'
import { getEventCounts } from '@/lib/dal';
import CountsTable from './counts-table';

async function TMSEvents({ host, day }: { host: string, day: string }) {
  const date = new Date()

  const dayObj: any = {
    'live': 0,
    'yesterday': 1,
    'day-before-yesterday': 2
  }

  const counts = await getEventCounts(host, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - (dayObj[day])}`, 'itms')

  return (
    <div>
        <div className="bg-muted-foreground/50 text-background text-center p-2">
            <h2 className="text-foreground text-sm font-medium">TMS Event Count</h2>
        </div>
        <CountsTable counts={counts} type={'itms'} host={host} day={day}/>
    </div>
  )
}

export default TMSEvents