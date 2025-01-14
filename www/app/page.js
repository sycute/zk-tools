"use client";
import Navbar from "@/components/Navbar.js";
import { Button, Drawer } from "antd";
import { useState } from "react";
// 修改元数据

import DrawBody from "@/components/drawBody.js";

export default function Home() {
  const [open, setOpen] = useState(false); //抽屉开关
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className="h-screen bg-white m-2 rounded-2xl relative">
      <Navbar />
      <div className="w-3/4  h-96 absolute left-1/2 translate-x-[-50%] top-40 border-8 rounded-3xl border-black flex flex-col justify-around items-center">
        <div>Create a Stash</div>
        <div>Choose one or more assets to send in the stash.</div>
        <div>
          <Button type="primary" onClick={showDrawer} className="mr-3">
            Choose Coins
          </Button>
          <Button>Choose Nfts</Button>
        </div>
      </div>
      <Drawer
        style={{ borderRadius: "10px 0 0 10px" }}
        styles={{ header: { display: "none" } }}
        width='500px'
        onClose={onClose}
        open={open}
      >
        <DrawBody />
      </Drawer>
    </div>
  );
}
