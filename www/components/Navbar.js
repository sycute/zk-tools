"use client";
import Link from "next/link";
import {
  ConnectButton,
  ConnectModal,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { useState } from "react";
import { truncateString } from "@/utils/util.js";
const nav = [
  // {
  //   title: "SEND",
  //   href: "/send",
  //   description: "",
  // },
  // {
  //   title: "APPS",
  //   href: "/receive",
  //   description: "",
  // },
  // {
  //   title: "HISTORY",
  //   href: "/",
  //   description: "",
  // },
];
const Navbar = () => {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="w-full  px-4 bg-slate-200 shadow-sm fixed  left-1/2 transform -translate-x-1/2 z-10 border border-b-slate-300">
        <div className="max-w-7xl h-14 mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="bg-black rounded-lg p-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-semibold text-lg">Next.js</span>
            </div>
          </Link>

          {/* Wallet Address */}

          {/* <ConnectButton className="bg-black" connectText="连接钱包" /> */}
          <ConnectModal
            trigger={
              <button disabled={!!currentAccount}>
                {currentAccount ? truncateString(currentAccount.address) : "Connect"}
              </button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
