import {useLocalStorage} from '@mantine/hooks';

export function useClientId(): string {
    const [clientId, _] = useLocalStorage<string>({key: 'clientId', defaultValue: ""});
    return clientId
}
