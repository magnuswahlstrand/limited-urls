import {trpc} from './utils/trpc';

import {Button} from '@mantine/core';

export default function Redirect() {
    const mutation = trpc.useMutation('redirect', {
        onSuccess: (data, variables, context) => {
            console.log(data)
            console.log("success")
            // window.location.replace(data.url);
        },
        onError: (error, variables, context) => {
            console.log("error")
            console.log(error, variables, context)
        }
    });

    const handleLogin = async () => {
        mutation.mutate({id: "565fe08e-3bf4-4699-a928-665767511f3x"});
    };

    if (mutation.data) {
        return (
            <div>{JSON.stringify(mutation.data)}</div>
        )
    }


    return (
        <Button variant="light" color="blue" fullWidth style={{marginTop: 14}}
                onClick={() => handleLogin()}>Redirect to URL for 565fe08e-3bf4-4699-a928-665767511f3e
        </Button>
    );
};
