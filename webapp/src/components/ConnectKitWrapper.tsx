"use client"
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { FC } from "react"
import { addEnsContracts } from "@ensdomains/ensjs";

console.table({
  "alchemy": process.env.NEXT_PUBLIC_ALCHEMY_ID,
  "walletconnect": process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  "contract": process.env.NEXT_PUBLIC_EAUTH_CONTRACT_ADDR
})

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [addEnsContracts(sepolia)],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "ENS Auth",

    ssr: true
  }),
);

const queryClient = new QueryClient();

const ConnectKitWrapper: FC<{children: React.ReactNode}> =  ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default ConnectKitWrapper;
