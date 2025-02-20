"use client";
import Link from "next/link";
import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
  useAccounts,
  useSwitchAccount,

} from "@mysten/dapp-kit";
import { useState } from "react";
import { truncateString } from "@/utils/util.js";
import {  Popover } from "antd";

const Navbar = () => {
  const currentAccount = useCurrentAccount();

  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: switchAccount } = useSwitchAccount();
  const accounts = useAccounts();

  const [open, setOpen] = useState(false);

  const content = (
    <div className="w-24 ">
      {accounts.map((account) => (
        <p
          className="border-b-[1px] border-b-slate-100 text-center cursor-pointer"
          key={account.address}
          onClick={() => {
            switchAccount(
              { account },
              {
                onSuccess: () => console.log(`switched to ${account.address}`),
              }
            );
          }}
        >
          {truncateString(account.address)}
        </p>
      ))}

      <p
        className="text-center text-base font cursor-pointer"
        onClick={() => {
          // 先把弹窗状态调一下，要不然会自动弹窗
          setOpen(false);
          setTimeout(() => {
            disconnect();
          });
        }}
      >
        disconnect
      </p>
    </div>
  );
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
              <span className="font-semibold text-lg">RP</span>
            </div>
          </Link>

          {/* Wallet Address */}
          {currentAccount ? (
            <Popover className="cursor-pointer" content={content} title="" trigger="click">
              {truncateString(currentAccount.address)}
            </Popover>
          ) : (
            <ConnectModal
              trigger={<button disabled={!!currentAccount}>Connect</button>}
              open={open}
              onOpenChange={(isOpen) => setOpen(isOpen)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
