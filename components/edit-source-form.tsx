'use client'

import React, { ChangeEvent, useActionState, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import Form from 'next/form'
import { editSource } from '@/actions/source'
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Source } from '@/lib/dal'

function EditSourceForm({ source }: { source: Source }) {
    const editSourceWithId = editSource.bind(null, source.id)
    const [formData, setFormdata] = useState<any>(
        {
            name: source.name,
            host: source.host,
            port: source.port,
            protocol: source.protocol,
            itms: source.itms,
            ivms: source.ivms,
            broker: source.broker
        }
    )

    const [state, formAction, isPending] = useActionState(editSourceWithId, undefined)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormdata((prevData: any) => ({...prevData, [e.target.name]: e.target.value}))
    }

  return (
    <Card>
        <CardHeader className='text-center'>
            <CardTitle className='text-xl'>Edit Data Source</CardTitle>
            <CardDescription>Modify the fields to update a Data Source</CardDescription>
            {
                !!state?.message && (
                    <FieldError>{state.message}</FieldError>
                )
            }
        </CardHeader>
        <CardContent>
            <Form action={formAction}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor='name'>Name</FieldLabel>
                        <Input 
                            id='name'
                            name='name'
                            placeholder='Enter Source Name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isPending}
                            aria-invalid={!!state?.errors?.name?.length}
                        />
                        {
                            !!state?.errors?.name?.length && (
                                <FieldError>{state.errors.name}</FieldError>
                            )
                        }
                    </Field>
                    <Field>
                        <FieldLabel htmlFor='host'>Host</FieldLabel>
                        <Input 
                            id='host'
                            name='host'
                            placeholder='000.000.000.000'
                            value={formData.host}
                            onChange={handleChange}
                            required
                            disabled={isPending}
                            aria-invalid={!!state?.errors?.host?.length}
                        />
                        {
                            !!state?.errors?.host?.length && (
                                <FieldError>{state.errors.host}</FieldError>
                            )
                        }
                    </Field>
                    <Field className='grid grid-cols-2 gap-4'>
                        <Field>
                            <FieldLabel htmlFor='protocol'>Protocol</FieldLabel>
                            <Select name='protocol' value={formData.protocol} onValueChange={(val) => setFormdata((prevData: any) => ({...prevData, protocol: val}))} disabled={isPending} >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a protocol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Protocols</SelectLabel>
                                        <SelectItem value="ws">WS</SelectItem>
                                        <SelectItem value="wss">WSS</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {
                                !!state?.errors?.protocol?.length && (
                                    <FieldError>{state.errors.protocol}</FieldError>
                                )
                            }
                        </Field>
                        <Field>
                            <FieldLabel htmlFor='port'>Port</FieldLabel>
                            <Input 
                                id='port'
                                name='port'
                                placeholder='1111'
                                value={formData.port}
                                onChange={handleChange}
                                required
                                disabled={isPending}
                                aria-invalid={!!state?.errors?.port?.length}
                            />
                            {
                                !!state?.errors?.port?.length && (
                                    <FieldError>{state.errors.port}</FieldError>
                                )
                            }
                        </Field>
                    </Field>
                    <Field>
                        <FieldLabel>Server Type</FieldLabel>
                        <Field className='grid grid-cols-2 gap-4'>
                            <Field>
                                <div className='flex gap-2 items-center'>
                                    <Checkbox id='itms' name='itms' checked={formData.itms} onCheckedChange={(checked) => setFormdata((prevData: any) => ({...prevData, itms: checked}))} disabled={isPending}/>
                                    <Label htmlFor='itms'>ITMS</Label>
                                </div>
                            </Field>
                            <Field>
                                <div className='flex gap-2 items-center'>
                                    <Checkbox id='ivms' name='ivms' checked={formData.ivms} onCheckedChange={(checked) => setFormdata((prevData: any) => ({...prevData, ivms: checked}))} disabled={isPending}/>
                                    <Label htmlFor='ivms'>IVMS</Label>
                                </div>
                            </Field>
                        </Field>
                        {
                            (!!state?.errors?.itms?.length || !!state?.errors?.ivms?.length) && (
                                <FieldError>{state.errors.itms || state.errors.ivms}</FieldError>
                            )
                        }
                    </Field>
                    <Field>
                        <FieldLabel>Choose Broker</FieldLabel>
                        <RadioGroup className='flex' value={formData.broker} onValueChange={(val) => setFormdata((prevData: any) => ({...prevData, broker: val}))} name='broker'>
                            <div className='flex gap-2 items-center'>
                                <RadioGroupItem value='stomp' id='stomp' className='border-muted-foreground'/>
                                <Label htmlFor='stomp'>Stomp WS</Label>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <RadioGroupItem value='ws' id='ws' className='border-muted-foreground'/>
                                <Label htmlFor='ws'>WS</Label>
                            </div>
                        </RadioGroup>
                        {
                            (!!state?.errors?.broker?.length) && (
                                <FieldError>{state.errors.broker}</FieldError>
                            )
                        }
                    </Field>
                    <Field>
                        <Button className='bg-sky-600 hover:bg-sky-500' disabled={isPending}>
                            {
                                isPending && (
                                    <Spinner />
                                )
                            }
                            Update
                        </Button>
                    </Field>
                </FieldGroup>
            </Form>
        </CardContent>
    </Card>
  )
}

export default EditSourceForm