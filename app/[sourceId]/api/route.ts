import { getEventCounts } from "@/lib/dal";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = await req.nextUrl.searchParams
    const host = searchParams.get('host') || ''
    const dayStartEpoch = Number(searchParams.get('dayStartEpoch')) || Number(0)
    const type = (searchParams.get('type') || 'itms') as 'itms'|'ivms'

    const data = await getEventCounts(host, dayStartEpoch, type)

    return Response.json(data)
}