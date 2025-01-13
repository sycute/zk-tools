"use client";
import HomePage from "./Home.js";
import React from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "./networkConfig.js";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <HomePage />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
