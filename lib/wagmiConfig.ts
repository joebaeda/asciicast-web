import { http, createConfig, injected} from "wagmi";
import { base } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [base],
  ssr: true,
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(),
  },
})
