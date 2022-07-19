import React, {useEffect} from 'react';
import {Button, createStyles, Loader} from '@mantine/core';
import {useParams} from 'react-router-dom';
import {trpc} from "../utils/trpc";
import MainContainer from "../components/MainContainer";

const useStyles = createStyles((theme) => ({}));

interface HeaderSimpleProps {
    links: { link: string; label: string }[];
}

export function ForwarderPage() {
    return (
        <MainContainer>
            <ForwarderContent/>
        </MainContainer>
    )
}

export function ForwarderContent() {
    let {urlId} = useParams() as { urlId: string };

    const mutation = trpc.useMutation('redirect', {
        onSuccess: (data, variables, context) => {
            console.log("success")
            console.log(data)
            window.location.replace(data.url.url);
        }
    });

    useEffect(() => {
        mutation.mutate({id: urlId})
    }, []);

    //
    // const handleNewURL = () => {
    //     // TODO FIx
    //     mutation.mutate({id: urlId ?? ""})
    // }

    if (mutation.isLoading) {
        return <div>Redirecting<Loader size="lg"/></div>
    }

    if (mutation.isError) {
        return <div>
            {mutation.error.message}

            <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
    }

    return (<div>
        Redirecting
        <Loader size="lg"/>
    </div>);
}
