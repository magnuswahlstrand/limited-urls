// utils/trpc.ts
import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../../../services/url/lambda';

export const trpc = createReactQueryHooks<AppRouter>();
