import { getEventCounts } from "@/lib/dal";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{sourceId: string}> }) {
    const searchParams = await req.nextUrl.searchParams
    const { sourceId } = await params
    const dayStartEpoch = Number(searchParams.get('dayStartEpoch')) || Number(0)
    const type = (searchParams.get('type') || 'itms') as 'itms'|'ivms'

    const data = await getEventCounts(sourceId, dayStartEpoch, type)

    return Response.json(data)
}