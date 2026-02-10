import { getCameraHourlyData } from "@/lib/dal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{channelId: string}>}) {
    const { channelId } = await params
    const searchParams = await req.nextUrl.searchParams
    const dayStartEpoch = Number(searchParams.get('dayStartEpoch')) || 0;

    const hourlyData = await getCameraHourlyData(channelId, dayStartEpoch)

    return NextResponse.json(hourlyData)
}