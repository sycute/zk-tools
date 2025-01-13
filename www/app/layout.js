"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { Children } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "./networkConfig.js";
import Link from "next/link";
const queryClient = new QueryClient();
// Config options for the networks you want to connect to
import Navbar from  "@/components/Navbar.js"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider
              networks={networkConfig}
              defaultNetwork="testnet"
            >
              <WalletProvider autoConnect>
              <Navbar />
                {children}
              
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
