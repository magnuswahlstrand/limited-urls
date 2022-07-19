import {DynamoDB} from "aws-sdk";
import {NewReq, URL} from "./model";
import {Result} from 'true-myth';
import {LinkHasExpiredError, UnknownError} from "./errors";


const tableName = process.env.TABLE_NAME ?? ""
const dynamoDb = new DynamoDB.DocumentClient();

export const InsertNewURL = async (id: string, newUrl: NewReq): Promise<Result<URL, never>> => {
    const now = new Date().toISOString()

    const u: URL = {
        id: id,
        ...newUrl,
        remaining_forwards: newUrl.max_forwards,
        created_at: now,
        updated_at: now
    }

    const putParams = {
        TableName: tableName,
        Item: u,
    };

    await dynamoDb.put(putParams).promise();
    return Result.ok(u);
}

export const getOverview = async (id: string): Promise<Result<URL, LinkHasExpiredError>> => {
    const getParams = {
        TableName: tableName,
        Key: {
            id: id,
        },
    };

    const result = await dynamoDb.get(getParams).promise();
    if (!result.Item) {
        return Result.err({type: 'link_has_expired', urlId: id});

    }
    return Result.ok(URL.parse(result.Item));
}

export const DecreaseURLForwards = async (urlId: string, token: string): Promise<Result<URL, LinkHasExpiredError | UnknownError>> => {
    const now = new Date().toISOString()
    const updateParams = {
        TableName: tableName,
        Key: {
            id: urlId,
        },
        UpdateExpression: `set remaining_forwards = remaining_forwards + :value, updated_at = :updated_at`,
        ExpressionAttributeValues: {
            ":value": -1,
            ":updated_at": now,
            ":zero": 0
        },
        ConditionExpression: `remaining_forwards > :zero AND attribute_exists(id)`,
        ReturnValues: "ALL_NEW",
    };


    try {
        const resp = await dynamoDb.update(updateParams).promise();

        return Result.ok(await URL.parseAsync(resp.Attributes))
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
