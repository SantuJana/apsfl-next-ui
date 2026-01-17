import { refreshLog } from '@/actions/log'
import RefreshButton from '@/components/refresh-btn'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getLogs } from '@/lib/dal'
import { RefreshCcw } from 'lucide-react'
import Form from 'next/form'
import React from 'react'

export const dynamic = 'force-dynamic';

async function Log() {
  const logs = await getLogs()

  if (!logs || !logs.length) {
    return (
      <h2>No Log Found</h2>
    )
  }

  return (
    <div>
      <div className='flex justify-end mb-1'>
        <RefreshButton />
      </div>
      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-sky-600'>
            <TableRow>
              <TableHead className='text-background text-sm'>Host</TableHead>
              <TableHead className='text-background text-sm'>Message</TableHead>
              <TableHead className='text-background text-sm'>Date Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className='text-xs p-1'>{log.host}</TableCell>
                  <TableCell className='text-xs p-1'>{log.message}</TableCell>
                  <TableCell className='text-xs p-1'>{new Date(log.date_time).toLocaleString()}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Log