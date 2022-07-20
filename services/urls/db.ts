import {DynamoDB} from "aws-sdk";
import {NewReq, OverviewResp, RedirectResp, URL} from "./model";
import {Result} from 'true-myth';
import {LinkHasExpiredError, LinkNotFoundError, NotAuthorizedError, UnknownError} from "./errors";


const tableName = process.env.TABLE_NAME ?? ""
const dynamoDb = new DynamoDB.DocumentClient();

export const InsertNewURL = async (id: string, newUrl: NewReq): Promise<Result<string, never>> => {
    const now = new Date().toISOString()

    const u = {
        id: id,
        ...newUrl,
        remaining_forwards: newUrl.max_forwards,
        created_at: now,
        updated_at: now,

        forwarded_at: dynamoDb.createSet([""]),
        forwarded_client_ids: dynamoDb.createSet([""]),
    }

    const putParams = {
        TableName: tableName,
        Item: u,
    };

    await dynamoDb.put(putParams).promise();
    return Result.ok(id);
}

function unwrapSet(itemElement: any) {
    return itemElement.values.filter((v: string) => v != "")
}

function parseUrlRecord(record: any) {
    // TODO: Is there a better way to handle sets?
    record["forwarded_at"] = unwrapSet(record["forwarded_at"])
    record["forwarded_client_ids"] = unwrapSet(record["forwarded_client_ids"])

    return URL.parse(record)
}

export const GetOverview = async (id: string, client_id: string): Promise<Result<OverviewResp, LinkNotFoundError | NotAuthorizedError>> => {
    const getParams = {
        TableName: tableName,
        Key: {
            id: id,
        },
    };

    const result = await dynamoDb.get(getParams).promise();
    if (!result.Item) {
        return Result.err({type: 'link_not_found', urlId: id});
    }

    const url = parseUrlRecord(result.Item)
    if (url.owner_client_id != client_id) {
        return Result.err({type: 'not_authorized', urlId: id});
    }

    const overview: OverviewResp = {
        id: url.id,
        url: url.url,
        max_forwards: url.max_forwards,
        remaining_forwards: url.remaining_forwards,
        created_at: url.created_at,
        updated_at: url.updated_at,
    }

    return Result.ok(overview);
}

export const DecreaseURLForwards = async (urlId: string, clientId: string): Promise<Result<RedirectResp, LinkHasExpiredError | LinkNotFoundError | UnknownError>> => {
    const result = await dynamoDb.get({TableName: tableName, Key: {id: urlId}}).promise();
    if (!result.Item) {
        return Result.err({type: 'link_not_found', urlId});
    }

    const url = parseUrlRecord(result.Item)
    if (url.forwarded_client_ids.includes(clientId) || url.owner_client_id == clientId) {
        return Result.ok({url: url.url})
    }

    const now = new Date().toISOString()
    const updateParams = {
        TableName: tableName,
        Key: {
            id: urlId,
        },
        UpdateExpression: `SET remaining_forwards = remaining_forwards + :value, updated_at = :now ADD forwarded_client_ids :client_id, forwarded_at :now`,
        ExpressionAttributeValues: {
            ":value": -1,
            ":now": now,
            ":zero": 0,
            ":client_id": dynamoDb.createSet([clientId]),
        },
        ConditionExpression: `remaining_forwards > :zero AND attribute_exists(id)`,
        ReturnValues: "ALL_NEW",
    };


    try {
        const resp = await dynamoDb.update(updateParams).promise();
        const u = parseUrlRecord(resp.Attributes)
        return Result.ok({url: u.url})
    } catch (e: unknown) {
        // TODO: How do we distinguish URL missing from Condition failed?
        console.log(JSON.stringify(e))
        console.log(typeof e)

        if (e instanceof Error && e.name === "ConditionalCheckFailedException") {
            return Result.err({type: "link_has_expired", urlId})
        }
        return Result.err({type: "unknown", err: e})
    }
}
