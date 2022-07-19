import * as trpc from '@trpc/server';
import {awsLambdaRequestHandler} from '@trpc/server/adapters/aws-lambda';
import {NewReq, OverviewReq, RedirectReq} from "./model";
import * as db from "./db";
import {v4} from 'uuid';
import {returnError} from "./errors";

const appRouter = trpc.router()
    .mutation('new', {
        input: NewReq,
        async resolve(req) {
            const id = v4()
            await db.InsertNewURL(id, req.input)
            return {id: id};
        },
    }).mutation("redirect", {
        input: RedirectReq,
        async resolve(req) {
            const result = await db.DecreaseURLForwards(req.input.id, req.input.client_id)
            if (result.isErr) {
                throw returnError(result.error);
            }

            return {url: result.value};
        },
    }).query('overview', {
        input: OverviewReq,
        async resolve(req) {
            const result = await db.GetOverview(req.input.id, req.input.client_id)
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
