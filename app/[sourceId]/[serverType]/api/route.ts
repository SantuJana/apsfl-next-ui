import { getCameras } from "@/lib/dal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{sourceId: string, serverType: string}>}) {
    const { sourceId, serverType } = await params
    const searchParams = await req.nextUrl.searchParams
    const dayStartEpoch = Number(searchParams.get('dayStartEpoch')) || 0

    const data = await getCameras(sourceId, serverType as "itms" | "ivms", dayStartEpoch)

    return NextResponse.json(data)
}