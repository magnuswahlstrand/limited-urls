import React from 'react';
import {GenerateURL} from "../components/UrlForm";
import {trpc} from "../utils/trpc";
import {useNavigate} from "react-router-dom";
import MainContainer from "../components/MainContainer";

export function GenerateUrlPage() {
    return (
        <MainContainer title="Generate a new limited URL">
            <GenerateUrlContent/>
        </MainContainer>
    )
}

export function GenerateUrlContent() {
    let navigate = useNavigate();

    const mutation = trpc.useMutation('new', {
        onSuccess: (data, variables, context) => {
            console.log("success")
            navigate(`/url/${data.id}/overview`);
        },
    });

    const handleNewURL = (url: string, maxRedirects: number) => {
        mutation.mutate({url, max_forwards: maxRedirects});
    }

    return <GenerateURL onSubmit={handleNewURL} isProcessing={mutation.isLoading}/>
}
