"use client"
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
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
const Navbar = () => {
  return (
      <header className=" flex justify-between items-center mx-auto px-4  max-w-[1440px]  ">
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
        <ConnectButton connectText="连接钱包" />
      </header>
  );
};

export default Navbar;
