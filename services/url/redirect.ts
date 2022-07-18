import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";
import UrlPattern from "url-pattern";
import * as db from "./db";
import {returnError} from "./errors";

let pattern = new UrlPattern('/url/:urlID');

const redirectHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const req = pattern.match(event.rawPath)
    if (!req || !(typeof req.urlID === "string")) {
        console.log("Received an event with incorrect URL format", event.rawPath)
        return {statusCode: 200, headers: {}};
    }


    const result = await db.DecreaseURLForwards(req.urlID, "")
    switch (result.isErr) {
        case true:
            return returnError(result.error);
        default:
            return {
                statusCode: 307,
                headers: {
                    "Location": result.value.url
                }
            };
    }
};

export const handler = redirectHandler;
