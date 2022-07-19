// @flow
import React, {useEffect} from 'react';
import {Button, createStyles, Group, Loader, Space, Title} from '@mantine/core';
import {useNavigate, useParams} from 'react-router-dom';
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

type Props = {
    title: string
    subtitle: string
    children: JSX.Element
};

export function ForwarderContainer({title, subtitle, children}: Props) {
    return (<Group position="center" p="xl">
            <Group position="center" direction="column" spacing={0}>
                <Title order={1}>{title}</Title>
                <Title order={4} p="sm">{subtitle}</Title>

                <Space h="md"/>
                {children}
            </Group>
        </Group>
    );
}

export function ForwarderContent() {
    let navigate = useNavigate();


    let {urlId} = useParams() as { urlId: string };

    const mutation = trpc.useMutation('redirect', {
        onSuccess: (data, variables, context) => {
            console.log("success")
            window.location.replace(data.url.url);
        }
    });

    useEffect(() => {
        mutation.mutate({id: urlId})
    }, []);


    if (mutation.isError) {
        const errMessage = (mutation.error.message === "link_has_expired") ?
            {title: "Link has expired", subtitle: "(or never existed)"} :
            {title: "An error occurred", subtitle: ""};

        return <ForwarderContainer title={errMessage.title} subtitle={errMessage.subtitle}>
            <Button onClick={() => navigate(`/`)}>Create your own link</Button>
        </ForwarderContainer>
    }

    return <ForwarderContainer title={"Loading URL metadata"} subtitle={"redirecting shortly"}>
        <Loader size="lg"/>
    </ForwarderContainer>
}
