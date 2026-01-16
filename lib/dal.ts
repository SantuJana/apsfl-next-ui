import { cache } from "react"
import 'server-only'

const API_URL = process.env.API_URL

if (!API_URL) throw new Error('API_URL not provided')

export type Source = {
    id: string,
    name: string,
    host: string,
    port: number,
    enabled: boolean,
    protocol: string,
    itms: boolean,
    ivms: boolean,
    broker: string,
}

export type EventCount = {
    time_range: string,
    event_count: string
}

export type Log = {
    host: string;
    message: string;
    date_time: Date;
}

export const getSources = cache(async () => {
    // await new Promise(resolve => setTimeout(resolve, 2000))
    try {
        const response = await fetch(`${API_URL}/source`)
        
        if (!response.ok) return null

        return await response.json() as Source[]
    } catch (error) {
        return null
    }
})

export const getSourceById = cache(async (id: string) => {
    // await new Promise(resolve => setTimeout(resolve, 2000))
    try {
        const response = await fetch(`${API_URL}/source/${id}`)
        
        if (!response.ok) return null

        return await response.json() as Source
    } catch (error) {
        return null
    }
})

export const getEventCounts = cache(async (host: string, date: string, type: 'itms' | 'ivms') => {
    // await new Promise(res => setTimeout(res, 4000))
    try {
        const response = await fetch(`${API_URL}/event/${host}/${date}/${type}`)

        if (!response.ok) return null

        return await response.json() as EventCount[]
    } catch (error) {
        return null
    }
})

export const getHourEventCount = cache(async (host: string, date: string, hour: number, type: 'itms' | 'ivms') => {
    try {
        const response = await fetch(`${API_URL}/event/${host}/${date}/${hour}/${type}`)

        if (!response.ok) return null

        return await response.json() as EventCount
    } catch (error) {
        return null
    }
})

export const getLogs = cache(async () => {
    console.log(API_URL)
    try {
        const response = await fetch(`${API_URL}/log`)

        if (!response.ok) return null

        return await response.json() as Log[]
    } catch (error) {
        return null
    }
})