"use client";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";

export default function Home() {
  return (
    <div className="min-h-screen bg-white-100 flex flex-col items-center justify-center">
      <ConnectButton connectText="连接钱包" style={{ color: "red" }} />
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Red pack Web</h1>
      <div className="space-y-4">
        <Link
          href="/send"
          className="nes-btn  is-error block w-64 py-3 px-6 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition duration-300 "
        >
          Send
        </Link>
        <Link
          href="/receive"
          style={{ display: "block" }}
          className="nes-btn block w-64 py-3 px-6 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Receive
        </Link>
      </div>
    </div>
  );
}
