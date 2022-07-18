import {ZodError} from "zod";
import {TRPCError} from "@trpc/server";

export interface UrlDoesNotExistError {
    readonly type: 'url_does_not_exist';
    readonly urlId: string;
}

export interface UnknownError {
    readonly type: 'unknown';
    readonly err: any;
}

export function returnError(error: UrlDoesNotExistError | UnknownError | ZodError) {
    if (error instanceof ZodError) {
        return new TRPCError({
            code: 'BAD_REQUEST',
            message: `Failed to parse payload: ${error.message}`,
            // optional: pass the original error to retain stack trace
        })
    }
    switch (error.type) {
        case 'url_does_not_exist':
            return new TRPCError({
                code: 'BAD_REQUEST',
                message: `URL doesn't exist: ${error.urlId}`,
            })

        case 'unknown':
            return new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Unknown error`,
            })
    }
}
