"use client";
import Navbar from "@/components/Navbar.js";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Drawer, Form, Input, Row, Col, InputNumber } from "antd";
import { useState } from "react";
// import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Transaction } from "@mysten/sui/transactions";
import { useTransactionExecution } from "@/api/useTransactionExecution.js";
import axios from "axios";

// 修改元数据
import DrawBody from "@/components/drawBody.js";
import {
  getCoins,
  combineCoins,
  splitCoins,
  intoBalance,
} from "@/api/suiData.js";
import { TESTNET_ZKREDPACK_PACKAGE_ID } from "@/components/networkConfig.js";
export default function Home() {
  const [open, setOpen] = useState(false); //抽屉开关
  const [amount, setAmount] = useState(0); // 红包数量
  const [passWord, setPassWord] = useState(""); //口令
  const [coinInfo, setCoinInfo] = useState({});
  // 这个数据原来是一个数组，后来改成最多只有一个。下面的循环没有改所以看起来冗余
  const [chosedCoin, setChosedCoin] = useState({});
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const executeTx = useTransactionExecution();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  // 从列表处接收选择数据
  const getChosedCoin = (val) => {
    setChosedCoin(val);
  };

  // 接收代币数据 TODO：其实也可以封装请求然后这里再请求一次
  const getCoinInfo = (val) => {
    setCoinInfo(val);
  };

  const send = async () => {
    let txb = new Transaction();
    // 获取口令加密字符串
    const { data: encryptedPassword } = await axios.get(
      `https://psw-gift-2xvg.shuttle.app/zkrpnew?e=${passWord}`
    );
    console.log(encryptedPassword);

    Object.keys(chosedCoin).forEach(async (type) => {
      let fullType = coinInfo[type].fullType;
      let coins = await getCoins(client, currentAccount, fullType);

      let given_balance;
      if (fullType == "0x2::sui::SUI") {
        given_balance = txb.splitCoins(txb.gas, [0.05 * 10 ** 9]);
      } else {
        await combineCoins(txb, coins, fullType);
        // 分割代币
        given_balance = await splitCoins(
          txb,
          coins[0],
          fullType,
          amount,
          coinInfo[type].decimals
        );
      }

      // 发送红包数据
      txb.moveCall({
        target: `${TESTNET_ZKREDPACK_PACKAGE_ID}::happyrp::create_rp`,
        arguments: [
          txb.object(
            "0x80011863aba3e88fb5f975ef124bd3bf3340398625a9372b52d583d012bcac17"
          ),
          txb.object(given_balance),
          txb.pure.u64(amount),
          txb.object(encryptedPassword),
        ],
        typeArguments: [fullType],
      });
      let res = executeTx(txb);
      console.log(res);
    });
  };

  return (
    <div className="h-screen bg-white m-2 rounded-2xl relative">
      <Navbar />
      {/* 选择Coin */}
      <div className="w-3/4 max-w-[800px] px-10  h-96 mx-auto mt-40 border-8 rounded-3xl border-black flex flex-col justify-around items-center">
        <div className="font-aeonik text-[28px] text-fill-content-primary font-bold -tracking-[0.01em]">
          Create a Stash
        </div>
        {Object.keys(chosedCoin).length == 0 && (
          <div>Choose one or more assets to send in the stash.</div>
        )}
        {Object.keys(chosedCoin).length > 0 && (
          <div className="bg-black rounded-3xl p-4 w-full">
            <div className="space-y-4">
              {Object.keys(chosedCoin).map((item) => {
                // {[1,2,3].map((item) => {
                // 选择结果列表
                return (
                  <div className="flex items-center justify-between" key={item}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full bg-no-repeat  bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${coinInfo[item]?.iconUrl})`,
                        }}
                      ></div>

                      <span className="text-white text-2xl font-aeonik">
                        {chosedCoin[item]}
                      </span>
                      <span className="text-lg text-gray-400">{item}</span>
                    </div>
                    <span className="text-gray-400 text-2xl font-aeonik">
                      {item} Token
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 输入口令 */}
        {Object.keys(chosedCoin).length > 0 && (
          <Form>
            <Row>
              <Col span={10} className="mr-8">
                <Form.Item label="红包数量">
                  <InputNumber
                    className=" border-gray-500"
                    onChange={(e) => {
                      setAmount(e);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label={<div style={{}}>口令</div>}>
                  <Input
                    className=" border-gray-500"
                    onChange={(e) => {
                      setPassWord(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}

        {/* 底部按钮 */}
        <div className="w-full flex justify-center items-center  bottom-4">
          <button
            className="flex-1 h-10 rounded-full border  bg-black hover:bg-black/90 text-white text-sm font-medium transition-colors mr-4"
            onClick={showDrawer}
          >
            CHOOSE COINS
          </button>
          <button
            className="flex-1 h-10 rounded-full  border-gray-200 bg-gray-100 hover:bg-gray-200  text-sm font-medium transition-colors disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
            disabled={Object.keys(chosedCoin).length == 0}
            onClick={send}
          >
            SEND
          </button>
        </div>
      </div>

      <Drawer
        style={{ borderRadius: "10px 0 0 10px" }}
        styles={{ header: { display: "none" } }}
        width="500px"
        onClose={onClose}
        open={open}
      >
        <DrawBody
          getChosedCoin={getChosedCoin}
          getCoinInfo={getCoinInfo}
          setOpen={setOpen}
        />
      </Drawer>
    </div>
  );
}
