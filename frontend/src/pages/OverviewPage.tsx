import React from 'react';
import {Button, createStyles, TextInput, Title} from '@mantine/core';
import {useParams} from 'react-router-dom';
import {trpc} from "../utils/trpc";
import {Copy} from 'tabler-icons-react';
import {useClipboard} from '@mantine/hooks';
import OverviewTable from "../components/OverviewTable";
import MainContainer from "../components/MainContainer";
import {useClientId} from "../lib/hooks";
import {ErrorContainer} from "../components/InnerContainer";

const useStyles = createStyles((theme, _params, getRef) => ({
    input: {
        backgroundColor: theme.colors.blue[1],
        padding: "15px 40px 40px 40px",
        borderRadius: theme.radius.sm,
    }
}));

const PublicURLInput = (props: { url: string }) => {
    const {classes} = useStyles();
    const clipboard = useClipboard();

    const copyBtn = (
        <Button
            variant={"outline"}
            fullWidth
            onClick={() => clipboard.copy(props.url)}>
            <Copy size={36} strokeWidth={2}/>
            {clipboard.copied}
        </Button>)

    return (<TextInput
        className={classes.input}
        m="xl"
        readOnly
        label="Your public URL"
        value={props.url}
        rightSection={copyBtn}
        rightSectionWidth={60}
    />)
}

export function OverviewPage() {
    return (
        <MainContainer>
            <OverviewContent/>
        </MainContainer>
    )
}


function handleError(errorStr: string) {
    switch (errorStr) {
        case "not_authorized":
            return <ErrorContainer title={"Not authorized"} subtitle={"(to view this link overview)"}/>
        case "link_not_found":
            return <ErrorContainer title={"Link not found"} subtitle={"(or never existed)"}/>
        default:
            return <ErrorContainer title={"An error occurred"} subtitle={""}/>
    }
}

export function OverviewContent() {
    let clientId = useClientId()
    let {urlId} = useParams() as { urlId: string };

    const {isLoading, isError, error, data} = trpc.useQuery(['overview', {id: urlId, client_id: clientId}], {
        retry: (failureCount, error) => {
            if (error.message === "link_not_found") {
                return false
            } else if(error.message === "not_authorized") {
                return false
            }
            console.log(error.message)
            return failureCount < 3
        }
    });
    const publicUrl = window.location.href.replace("/overview", "")


    if (isLoading) {
        return <><Title align="center" order={1}>Overview</Title><PublicURLInput url=""/><OverviewTable/></>
    } else if (isError) {
        return handleError(error.message)
    } else if (!data) {
        return handleError("unknown")
    } else {
        return <><Title align="center" order={1}>Overview</Title><PublicURLInput url={publicUrl}/><OverviewTable
            url={data} publicUrl={publicUrl}/></>
    }
}
