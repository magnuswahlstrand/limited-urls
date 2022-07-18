import {trpc} from './utils/trpc';
import { useNavigate } from "react-router-dom";


export default function IndexPage() {
    let navigate = useNavigate();

    const mutation = trpc.useMutation(['new'], {
        onSuccess: (data, variables, context) => {
            console.log(data)
            console.log("success")
            window.location.replace('https://google.com');
        },
    });

    const handleLogin = async () => {
        mutation.mutate({url: "https://www.google.com", max_forwards: 3});
    };

    if (mutation.data) {
        return (
            <div>URL created:
                <div>{mutation.variables?.url}</div>
                {mutation.data.id}
            </div>)
    }

    return (
        <div>
            <button onClick={() => handleLogin()}>Add google as a redirect</button>
        </div>
    );
};
