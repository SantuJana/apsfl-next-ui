import Image from 'next/image'
import React from 'react'

function Loader({ text, size = 'small', className }: { text?: string, size?: 'large' | 'small', className?: string }) {
  return (
    <div className={'flex flex-col justify-center items-center -gap-2 '+ className}>
        <Image src={'/loader.svg'} width={size === 'small' ? 60 : 100} height={size === 'small' ? 60 : 100} alt='Loading' />
        {
            !!text && (
                <p className={`animate-pulse ${size === 'small' ? 'text-sm' : ''}`}>{text}</p>
            )
        }
    </div>
  )
}

export default Loader