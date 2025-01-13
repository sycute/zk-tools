"use client";
import React, { Children } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "./networkConfig.js";
import Link from "next/link";
const queryClient = new QueryClient();
const nav = [
  {
    title: "SEND",
    href: "/send",
    description: "",
  },
  {
    title: "APPS",
    href: "/receive",
    description: "",
  },
  {
    title: "HISTORY",
    href: "/",
    description: "",
  },
];

export default function Home() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <div className="min-h-screen bg-white-100 relative">
              <header className="flex justify-between items-center mx-auto px-4 lg:px-0 max-w-[1440px]">
                <h1 className="text-2xl">Next.js</h1>
                <nav>
                  <ul className="flex gap-4">
                    {nav.map((item) => (
                      <li key={item.title}>
                        <Link href={item.href}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <ConnectButton
                  connectText="连接钱包"
                  style={{ color: "red" }}
                />
              </header>
            </div>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
