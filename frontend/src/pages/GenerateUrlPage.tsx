import React from 'react';
import {GenerateURL} from "../components/UrlForm";
import {trpc} from "../utils/trpc";
import {useNavigate} from "react-router-dom";
import MainContainer from "../components/MainContainer";
import {useClientId} from "../lib/hooks";

export function GenerateUrlPage() {
    return (
        <MainContainer title="Generate a new limited URL">
            <GenerateUrlContent/>
        </MainContainer>
    )
}

export function GenerateUrlContent() {
    let clientId = useClientId()
    let navigate = useNavigate();

    const mutation = trpc.useMutation('new', {
        onSuccess: (data, variables, context) => {
            navigate(`/url/${data.id}/overview`);
        },
    });

    const handleNewURL = (url: string, maxRedirects: number) => {
        mutation.mutate({url, max_forwards: maxRedirects, owner_client_id: clientId});
    }

    return <GenerateURL onSubmit={handleNewURL} isProcessing={mutation.isLoading}/>
}
