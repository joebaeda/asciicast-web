import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [base],
  ssr: true,
  connectors: [
    coinbaseWallet({
      appName: "asciicast",
      appLogoUrl: "https://www.asciicast.com/icon.jpg",
      preference: "all",
    }),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
