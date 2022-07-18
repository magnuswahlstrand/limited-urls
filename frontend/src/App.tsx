import React, {useState} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {trpc} from './utils/trpc';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {MantineProvider} from '@mantine/core';
import {GenerateUrlPage} from "./pages/GenerateUrlPage";
import {ForwarderPage} from "./pages/ForwarderPage";
import {OverviewPage} from "./pages/OverviewPage";


export default function App() {

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            url: 'https://sfbonowsyhjdf36w2brknwzyzu0vjyzf.lambda-url.us-east-1.on.aws',
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
