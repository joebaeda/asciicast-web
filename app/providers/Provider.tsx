"use client"

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmiConfig";


const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            {/* */}
            {children}
            {/* */}
          </QueryClientProvider>
        </WagmiProvider>
  );
}