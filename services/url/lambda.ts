import * as trpc from '@trpc/server';
import {awsLambdaRequestHandler} from '@trpc/server/adapters/aws-lambda';
import {NewReq, RedirectReq} from "./model";
import * as db from "./db";
import {v4} from 'uuid';
import {returnError} from "./errors";
import {z} from "zod";

const appRouter = trpc.router()
    .mutation('new', {
        input: NewReq,
        async resolve(req) {
            const id = v4()
            const result = await db.InsertNewURL(id, req.input)
            // TODO: add stuff
            return {id: id};
        },
    }).mutation("redirect", {
        input: RedirectReq,
        async resolve(req) {
            const result = await db.DecreaseURLForwards(req.input.id, "")
            if (result.isErr) {
                throw returnError(result.error);
            }

            return {id: req.input.id, url: result};
        },
    }).query('overview', {
        input: z.string(),
        async resolve(req) {
            const result = await db.getOverview(req.input)
            if (result.isErr) {
                throw returnError(result.error);
            }

            return result.value;
        }
    })

export type AppRouter = typeof appRouter

export const handler = awsLambdaRequestHandler({
    router: appRouter,
})
