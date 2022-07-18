import * as React from 'react';
import {Container, Paper, Title} from '@mantine/core';

type Props = {
    title?: string,
    children: JSX.Element,
};

export default function MainContainer({title, children}: Props) {
    return (
        <Container p="xl">
            <Paper shadow="lg" p="xl">
                {title ? <Title order={1}>{title}</Title> : null}
                {children}
            </Paper>
        </Container>)
}
