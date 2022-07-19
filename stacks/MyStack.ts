import {Function, ReactStaticSite, StackContext, Table} from "@serverless-stack/resources";

export function MyStack({stack}: StackContext) {
    const table = new Table(stack, "UrlTable", {
        fields: {
            id: "string",
        },
        primaryIndex: {partitionKey: "id"},
    });

    const fn = new Function(stack, "trpc", {
        environment: {
            TABLE_NAME: table.tableName,
        },
        handler: "urls/trpc.handler",
        permissions: [table],
        url: true,
    })

    // Deploy our React app
    const site = new ReactStaticSite(stack, "ReactSite", {
        path: "frontend",
        environment: {
            REACT_APP_API_URL: fn.url ?? "",
        },
    });

    // Show the URLs in the output
    stack.addOutputs({
        SiteUrl: site.url,
        ApiEndpoint: fn.url ?? "",
    });
}
