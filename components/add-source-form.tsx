'use client'

import React, { useActionState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import Form from 'next/form'
import { addSource } from '@/actions/source'
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

function AddSourceForm() {
    const [state, formAction, isPending] = useActionState(addSource, undefined)

  return (
    <Card>
        <CardHeader className='text-center'>
            <CardTitle className='text-xl'>Add Data Source</CardTitle>
            <CardDescription>Fill all the fields to add a Data Source</CardDescription>
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
                            <Select name='protocol' defaultValue='wss' disabled={isPending} >
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
                                defaultValue={'7443'}
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
                                    <Checkbox id='itms' name='itms' defaultChecked disabled={isPending}/>
                                    <Label htmlFor='itms'>ITMS</Label>
                                </div>
                            </Field>
                            <Field>
                                <div className='flex gap-2 items-center'>
                                    <Checkbox id='ivms' name='ivms' defaultChecked disabled={isPending}/>
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
                        <RadioGroup className='flex' defaultValue='stomp' name='broker'>
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
                            Add
                        </Button>
                    </Field>
                </FieldGroup>
            </Form>
        </CardContent>
    </Card>
  )
}

export default AddSourceForm