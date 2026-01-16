import * as z from 'zod'
import net from "node:net"

const hostnameRegex =
  /^(localhost|([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;

export const AddSourceFormSchema = z.object({
    name: z
    .string()
    .min(3, { error: 'Name must be at least 3 characters long.' })
    .trim(),
    host: z
    .string()
    .trim(),
    // .refine(
    //     (v) => net.isIP(v) !== 0 || hostnameRegex.test(v),
    //     {
    //     message: "Must be a valid IP address or hostname",
    //     }
    // ),
    protocol: z
    .enum(['wss', 'ws'], { error: 'Invalid protocol.'}),
    port: z
    .number({ error: 'Invalid port.' })
    .int()
    .min(1, { error: 'Invalid port.' })
    .max(65535, { error: 'Invalid port.' }),
    itms: z
    .boolean({ error: 'Invalid server type.'}),
    ivms: z
    .boolean({ error: 'Invalid server type.'}),
    broker: z
    .enum(['ws', 'stomp'], { error: 'Invalid broker.'})
})