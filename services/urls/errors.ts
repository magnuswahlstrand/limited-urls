import {ZodError} from "zod";
import {TRPCError} from "@trpc/server";

export interface LinkHasExpiredError {
    readonly type: 'link_has_expired';
    readonly urlId: string;
}

export interface LinkNotFoundError {
    readonly type: 'link_not_found';
    readonly urlId: string;
}

export interface NotAuthorizedError {
    readonly type: 'not_authorized';
    readonly urlId: string;
}

export interface UnknownError {
    readonly type: 'unknown';
    readonly err: any;
}

export function returnError(error: LinkHasExpiredError | UnknownError | LinkNotFoundError | NotAuthorizedError | ZodError) {
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

        case "link_not_found":
            return new TRPCError({
                code: "NOT_FOUND",
                message: `link_not_found`,
            })
        case "not_authorized":
            return new TRPCError({
                code: "UNAUTHORIZED",
                message: `not_authorized`,
            })

        default:
            return new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `unknown_error`,
            })
    }
}
