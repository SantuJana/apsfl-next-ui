import { NextRequest } from "next/server";
import https from 'https'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const host = searchParams.get('host')
    const port = searchParams.get('port')
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const url = `https://${host}:${port}/V1/REST/websocket/data/overview/${start}/${end}`

    return fetch(url, { cache: 'no-store' })
}