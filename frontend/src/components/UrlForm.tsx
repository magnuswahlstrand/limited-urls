import React from 'react';
import {Box, Button, Grid, Group, NativeSelect, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';

function addSchemaIfMissing(s: string) {
    if (!s.startsWith("http://") && !s.startsWith("https://")) {
        return "https://" + s
    }
    return s
}

function isValidHttpUrl(s: string) {
    let url;

    s = addSchemaIfMissing(s)
    try {
        url = new URL(s);
    } catch (e) {
        return "Invalid URL";
    }

    if(s.split(".").length < 2) {
        return "Invalid URL";
    }


    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return "Invalid protocol, use https"
    }

    return null
}

interface Props {
    onSubmit: (url: string, maxRedirects: number) => void;
    isProcessing: boolean
}

export function GenerateURL({onSubmit, isProcessing}: Props) {
    const form = useForm({
        initialValues: {
            url: '',
            maxRedirects: "25",
        },

        validate: {
            url: (value) => isValidHttpUrl(value)
        },
    });

    return (
        <Box sx={{maxWidth: 800}} mx="auto">
            <form onSubmit={form.onSubmit((values) => {
                onSubmit(addSchemaIfMissing(values.url), parseInt(values.maxRedirects))
            })}>
                <Grid>
                    <Grid.Col span={8}>
                        <TextInput
                            required
                            label="URL"
                            placeholder="yourdomain.com/path"
                            {...form.getInputProps('url')}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <NativeSelect
                            label="Max number of views"
                            data={["1", "10", "25", "50"]}
                            {...form.getInputProps('maxRedirects', {type: 'input'})}

                        />
                    </Grid.Col>
                </Grid>


                <Group position="right" mt="md">
                    <Button type="submit" loading={isProcessing}>Submit</Button>
                </Group>
            </form>
        </Box>
    );
}
