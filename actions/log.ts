'use server'

import { revalidatePath } from "next/cache";

export async function refreshLog(formData: FormData) {
    revalidatePath('/log')
}