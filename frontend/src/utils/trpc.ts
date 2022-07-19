// utils/trpc.ts
import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../../../services/urls/trpc';

export const trpc = createReactQueryHooks<AppRouter>();
