import { getHourEventCount } from "@/lib/dal";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{host: string, date: string, hour: string, type: string}> }) {
    const {host, date, hour, type} = await params
    try {
        const response = await getHourEventCount(host, date, Number(hour), type as 'itms'|'ivms')

        return Response.json(response || null)
    } catch (error) {
        return Response.json(null)
    }
}