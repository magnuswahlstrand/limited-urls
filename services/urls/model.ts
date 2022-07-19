import {z} from 'zod';

export const URL = z.object({
    id: z.string(),
    url: z.string().url(),
    max_forwards: z.number(),
    remaining_forwards: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const NewReq = z.object({
    url: z.string().url(),
    max_forwards: z.number(),
})

export const RedirectReq = z.object({
    id: z.string(),
})



export type URL = z.infer<typeof URL>
export type NewReq = z.infer<typeof NewReq>
export type RedirectReq = z.infer<typeof RedirectReq>
