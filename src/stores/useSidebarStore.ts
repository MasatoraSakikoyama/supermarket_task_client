'use client';

import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

// Initialize sidebar state based on window size
// Note: This resize listener is intentionally global and persists for the app lifetime
// to maintain responsive sidebar behavior throughout the application
if (typeof window !== 'undefined') {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      useSidebarStore.setState({ isOpen: false });
    } else {
      useSidebarStore.setState({ isOpen: true });
    }
  };

  // Set initial state
  handleResize();

  // Listen for resize events
  window.addEventListener('resize', handleResize);
}
