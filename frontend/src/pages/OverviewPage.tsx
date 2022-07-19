import React from 'react';
import {Button, createStyles, TextInput} from '@mantine/core';
import {useParams} from 'react-router-dom';
import {trpc} from "../utils/trpc";
import {Copy} from 'tabler-icons-react';
import {useClipboard} from '@mantine/hooks';
import OverviewTable from "./Overview/Table";
import MainContainer from "../components/MainContainer";

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
        <MainContainer title="Overview">
            <OverviewContent/>
        </MainContainer>
    )
}

export function OverviewContent() {
    let {urlId} = useParams() as { urlId: string };

    const {isLoading, isError, error, data} = trpc.useQuery(['overview', urlId]);
    const publicUrl = window.location.href.replace("/overview", "")

    if (isLoading) {
        return <><PublicURLInput url=""/><OverviewTable/></>
    } else if (isError) {
        return <div>Something went wrong: {error.message}</div>
    } else if (!data) {
        return <div>Something went wrong</div>
    } else {
        return <><PublicURLInput url={publicUrl}/><OverviewTable url={data}/></>
    }
}
