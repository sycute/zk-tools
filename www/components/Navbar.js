"use client"
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
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
  return (
      <header className="px-16 flex justify-between items-center mx-auto  w-full max-w-[1440px] fixed top-2 left-1/2 transform -translate-x-1/2   z-10">
        <h1 className="text-2xl block bg-white  p-2 rounded-lg shadow-lg">Next.js</h1>
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
