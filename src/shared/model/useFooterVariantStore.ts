import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FooterVariantState {
  variant: number;
  setVariant: (v: number) => void;
}

export const useFooterVariantStore = create<FooterVariantState>()(
  persist(
    (set) => ({
      variant: 1,
      setVariant: (v: number) => set({ variant: v }),
    }),
    { name: 'skillflow_footer_variant' }
  )
);
