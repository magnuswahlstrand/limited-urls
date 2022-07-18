import React from 'react';
import {Container, createStyles, Paper, Title} from '@mantine/core';
import {useParams} from 'react-router-dom';

const useStyles = createStyles((theme) => ({}));

interface HeaderSimpleProps {
    links: { link: string; label: string }[];
}

export function ForwarderPage() {
    let {urlId} = useParams();

    const handleNewURL = (url: string, maxRedirects: number) => {
        console.log(url, maxRedirects)
    }

    return (
        <Container p="xl">
            <Paper shadow="lg" p="xl">
                <Title order={1} m={"xl"}>Should redirect</Title>
                Hello
                {urlId}
            </Paper>
        </Container>
    );
}
