"use client";
import React from "react";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "./networkConfig.js";

const queryClient = new QueryClient();

export default function Provider({ children }) {
  return (
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider
              networks={networkConfig}
              defaultNetwork="testnet"
            >
              <WalletProvider autoConnect>
                {children}
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </React.StrictMode>
  );
}