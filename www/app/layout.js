import "./globals.css";
import React from "react";
import "@mysten/dapp-kit/dist/index.css";
import "@ant-design/v5-patch-for-react-19";
import Provider from "@/components/Provider";
import Navbar from "@/components/Navbar.js";
export const metadata = {
  title: "发个红包",
  description: "A Next.js client-side page example with metadata.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 ">
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
