'use client';

import { ReactNode } from 'react';
import { useSidebarStore } from '@/stores/useSidebarStore';

/**
 * SidebarProvider component - now using Zustand for state management
 * This component is kept for backwards compatibility but doesn't need to do anything
 * since Zustand manages the state globally
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Hook to access sidebar state and actions
 * Now uses Zustand store instead of React Context
 */
export function useSidebar() {
  return useSidebarStore();
}
