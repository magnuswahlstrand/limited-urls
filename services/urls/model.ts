import {z} from 'zod';
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {DynamoDB} from "aws-sdk";

export const URL = z.object({
    id: z.string(),
    url: z.string().url(),
    max_forwards: z.number(),
    remaining_forwards: z.number(),
    owner_client_id: z.string().uuid(),
    created_at: z.string(),
    updated_at: z.string(),

    forwarded_at: z.array(z.string()),
    forwarded_client_ids: z.array(z.string()),
    // forwarded_at: z.array(z.string()),
    // forwarded_at: z.array(z.string()),
    // forwarded_client_ids: z.array(z.string()),
})

export const OverviewResp = z.object({
    id: z.string(),
    url: z.string().url(),
    max_forwards: z.number(),
    remaining_forwards: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const RedirectResp = z.object({
    url: z.string().url()
})


export const NewReq = z.object({
    url: z.string().url(),
    max_forwards: z.number(),
    owner_client_id: z.string().uuid(),
})

export const RedirectReq = z.object({
    id: z.string(),
    client_id: z.string().uuid(),
})

export const OverviewReq = RedirectReq


export type URL = z.infer<typeof URL>
export type NewReq = z.infer<typeof NewReq>
export type RedirectReq = z.infer<typeof RedirectReq>
export type RedirectResp = z.infer<typeof RedirectResp>
export type OverviewReq = z.infer<typeof OverviewReq>
export type OverviewResp = z.infer<typeof OverviewResp>
