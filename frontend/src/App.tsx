import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {trpc} from './utils/trpc';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {MantineProvider} from '@mantine/core';
import {GenerateUrlPage} from "./pages/GenerateUrlPage";
import {ForwarderPage} from "./pages/ForwarderPage";
import {OverviewPage} from "./pages/OverviewPage";
import {useLocalStorage} from '@mantine/hooks';
import {v4 as uuidv4} from 'uuid';

// hook will read value from localStorage.getItem('color-scheme')
// if localStorage is not available or value at given key does not exist
// 'dark' will be assigned to value variable

const API_URL = process.env.REACT_APP_API_URL ?? ""

export default function App() {
    console.log("api_url", API_URL)
    const [clientId, setClientId] = useLocalStorage<string>({key: 'clientId', defaultValue: ""});

    useEffect(() => {
        if (clientId) return

        setClientId(uuidv4())
    }, []);

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            url: API_URL,
        }),
    );
    return (
        <MantineProvider>
            <BrowserRouter>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        <Routes>
                            <Route path="/url/:urlId/overview" element={<OverviewPage/>}/>
                            <Route path="/url/:urlId" element={<ForwarderPage/>}/>
                            <Route path="/" element={<GenerateUrlPage/>}/>
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                        </Routes>
                    </QueryClientProvider>
                </trpc.Provider>
            </BrowserRouter>
        </MantineProvider>
    );
}
