'use server'

import * as z from 'zod'
import { AddSourceFormSchema } from "@/lib/definations"
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.API_URL

if (!API_URL) throw new Error('API_URL not found.')

export type FormState = 
 |
    {
        errors?: {
            name?: string[];
            host?: string[];
            protocol?: string[];
            port?: string[];
            itms?: string[];
            ivms?: string[];
            broker?: string[];
        },
        message?: string
    }
 | undefined

export async function addSource(prevState: any, formData: FormData) {
    const payload = {
        name: formData.get('name'),
        host: formData.get('host'),
        protocol: formData.get('protocol'),
        port: Number(formData.get('port')),
        itms: formData.get('itms') === 'on' ? true : false,
        ivms: formData.get('ivms') === 'on' ? true : false,
        broker: formData.get('broker')
    }

    const validatedFields = AddSourceFormSchema.safeParse(payload)

    if (!validatedFields.success) {
        return { errors: z.flattenError(validatedFields.error).fieldErrors } as FormState
    }

    try {
        const response = await fetch(`${API_URL}/source`, {
            method: 'post',
            headers: {
                'content-type': 'Application/json'
            },
            body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
            const data = await response.json()
            return { message: data.error || 'Failed to add Data Source.' } as FormState
        }
    } catch (error) {
        return { message: 'Failed to add Data Source.' } as FormState
    }

    revalidatePath('/add-data-source')
}

export async function editSource(id: string, prevState: any, formData: FormData) {
    if (!id) {
        return { message: 'Source identity not found.' } as FormState
    }

    const payload = {
        name: formData.get('name'),
        host: formData.get('host'),
        protocol: formData.get('protocol'),
        port: Number(formData.get('port')),
        itms: formData.get('itms') === 'on' ? true : false,
        ivms: formData.get('ivms') === 'on' ? true : false,
        broker: formData.get('broker')
    }

    const validatedFields = AddSourceFormSchema.safeParse(payload)

    if (!validatedFields.success) {
        return { errors: z.flattenError(validatedFields.error).fieldErrors } as FormState
    }

    try {
        const response = await fetch(`${API_URL}/source/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'Application/json'
            },
            body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
            const data = await response.json()
            return { message: data.error || 'Failed to update Data Source.' } as FormState
        }
    } catch (error) {
        return { message: 'Failed to update Data Source.' } as FormState
    }

    revalidatePath(`/${id}`)
    redirect(`/${id}`)
}

export async function deleteSource(id: string, formData: FormData) {
    try {
        const response = await fetch(`${API_URL}/source/${id}`, {
            method: 'delete'
        })

        // if (!response.ok) {
        //     return { message: 'Failed to delete the Source.' } as FormState
        // }
    } catch (error) {
        // return { message: 'Failed to delete the Source.' } as FormState
    }

    revalidatePath('/')
}

export async function toggleSourceStatus(id: string, formData: FormData) {
    try {
        const response = await fetch(`${API_URL}/source/${id}`, {
            method: 'PATCH',
        })
    } catch (error) {
        console.log(error)
    }

    revalidatePath('/')
}