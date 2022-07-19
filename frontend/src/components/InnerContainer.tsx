import * as React from 'react';
import {Button, Group, Space, Title} from '@mantine/core';

import {useNavigate} from 'react-router-dom';

type Props = {
    title: string
    subtitle: string
    children: JSX.Element
};

export default function InnerContainer({title, subtitle, children}: Props) {
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

export function ErrorContainer({title, subtitle}: { title: string, subtitle: string }) {
    let navigate = useNavigate();

    return <InnerContainer title={title} subtitle={subtitle}>
        <Button onClick={() => navigate(`/`)}>Create your own link</Button>
    </InnerContainer>
}
