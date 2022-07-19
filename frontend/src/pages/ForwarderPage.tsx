// @flow
import React, {useEffect} from 'react';
import {Loader} from '@mantine/core';
import {useNavigate, useParams} from 'react-router-dom';
import {trpc} from "../utils/trpc";
import MainContainer from "../components/MainContainer";
import {useClientId} from "../lib/hooks";
import InnerContainer, {ErrorContainer} from "../components/InnerContainer";

export function ForwarderPage() {
    return (
        <MainContainer>
            <ForwarderContent/>
        </MainContainer>
    )
}


export function ForwarderContent() {
    let clientId = useClientId()
    let navigate = useNavigate();


    let {urlId} = useParams() as { urlId: string };

    const mutation = trpc.useMutation('redirect', {
        onSuccess: (data, variables, context) => {
            console.log("success")
            window.location.replace(data.url.url);
        }
    });

    useEffect(() => {
        mutation.mutate({id: urlId, client_id: clientId})
    }, []);


    if (mutation.isError) {
        if (mutation.error.message === "link_has_expired") {
            return <ErrorContainer title={"Link has expired"} subtitle={"(or never existed)"}/>
        }
        return <ErrorContainer title={"An error occurred"} subtitle={""}/>
    }

    return <InnerContainer title={"Loading URL metadata"} subtitle={"redirecting shortly"}>
        <Loader size="lg"/>
    </InnerContainer>
}
