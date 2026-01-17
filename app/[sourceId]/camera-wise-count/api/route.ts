import { getCameraWiseCount } from "@/lib/dal";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{sourceId: string}>}) {
    const { sourceId } = await params
    const searchParams = await req.nextUrl.searchParams
    const dayStartEpoch = Number(searchParams.get('dayStartEpoch')) || 0

    const data = await getCameraWiseCount(sourceId, dayStartEpoch)
    return Response.json(data)
}