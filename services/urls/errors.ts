import {ZodError} from "zod";
import {TRPCError} from "@trpc/server";

export interface LinkHasExpiredError {
    readonly type: 'link_has_expired';
    readonly urlId: string;
}

export interface UnknownError {
    readonly type: 'unknown';
    readonly err: any;
}

export function returnError(error: LinkHasExpiredError | UnknownError | ZodError) {
    if (error instanceof ZodError) {
        return new TRPCError({
            code: 'BAD_REQUEST',
            message: `Failed to parse payload: ${error.message}`,
        })
    }
    switch (error.type) {
        case 'link_has_expired':
            return new TRPCError({
                code: "NOT_FOUND",
                message: `link_has_expired`,
            })

        case 'unknown':
            return new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `unknown_error`,
            })
    }
}
