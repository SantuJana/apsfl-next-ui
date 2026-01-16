import { getSourceById, getSources, Source } from "@/lib/dal";
import { redirect } from "next/navigation";
import Image from "next/image";
import VMSEvents from "@/components/vms-events";
import TMSEvents from "@/components/tms-events";

export const dynamic = 'force-dynamic'

export default async function Home() {
    const sources = await getSources();

    if (sources && !!sources.length) {
      return redirect(`/${sources[0].id}`)
    }

    return (
      <h1>No Source Selected</h1>
    ) 
}
