"use client";
import "./MyBtn.css";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import {
  Drawer,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  message,
  Button,
} from "antd";
import { useState, useRef } from "react";
// import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Transaction } from "@mysten/sui/transactions";
import { useTransactionExecution } from "@/api/useTransactionExecution.js";
import axios from "axios";
import { TESTNET_REDPACKSTORE_OBJECT_ID } from "@/components/networkConfig.js";

// 修改元数据
import DrawBody from "@/components/drawBody.js";
import RpList from "@/components/rpList.js";
import { getCoins, combineCoins, splitCoins } from "@/api/suiData.js";
import { TESTNET_ZKREDPACK_PACKAGE_ID } from "@/components/networkConfig.js";
export default function Home() {
  const [open, setOpen] = useState(false); //抽屉开关
  const rpListChild = useRef(null);
  const [amount, setAmount] = useState(0); // 红包数量
  const [passWord, setPassWord] = useState(""); //口令
  const [coinInfo, setCoinInfo] = useState({});
  const [loading, setLoading] = useState(false); // 加载状态

  // 这个数据原来是一个数组，后来改成最多只有一个。下面的循环没有改所以看起来冗余
  const [chosedCoin, setChosedCoin] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();

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

  const send = () => {
    
    form
      .validateFields()
      .then(async () => {
        setLoading(true);
        try{
          let txb = new Transaction();
          // 获取口令加密字符串
          const { data: encryptedPassword } = await axios.get(
            `https://psw-gift-2xvg.shuttle.app/zkrpnew?e=${passWord}`
          );
          console.log("encryptedPassword==>",encryptedPassword);
  
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
                txb.object(TESTNET_REDPACKSTORE_OBJECT_ID),
                txb.object(given_balance),
                txb.pure.u64(amount),
                txb.pure.string(encryptedPassword),
              ],
              typeArguments: [fullType],
            });
            let res = await executeTx(txb);
            console.log(res);
            if(res){
              messageApi.open({
                type: "success",
                content: "claimed successfully!",
              });
            }else{
              messageApi.error({
                type: "error",
                content: "claimed failed!",
              });
            }
            setLoading(false);
            // 刷新红包列表
            setTimeout(()=>{
              rpListChild.current?.getRcinfo();
            },1000)
            
          });
      
        }catch(e){
          console.log(e);
          messageApi.error({
            type: "failed",
            content: "send failed!",
          });
          setLoading(false);
        }   
      })

   
    
  };

  return (
    <div className="min-h-screen   relative pb-56 pt-24">
      {contextHolder}
     
      {/* 选择Coin */}
      <div className="w-3/4 max-w-[800px] px-10  h-96 mx-auto    flex flex-col justify-around items-center rounded-2xl shadow-lg bg-slate-50">
        <div className="font-aeonik text-[28px] text-fill-content-primary font-bold -tracking-[0.01em]">
          Create a Red Packet
        </div>
        {Object.keys(chosedCoin).length == 0 && (
          <div>Choose one assets to send in the red packet</div>
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
          <Form form={form}>
            <Row>
              <Col span={10} className="mr-8">
                <Form.Item
                  name="amount"
                  label="红包数量"
                  rules={[
                    {
                      required: true,
                      message: "Please input Amount!",
                    },
                  ]}
                >
                  <InputNumber
                    className=" border-gray-200"
                    min={0}
                    max={9999}
                    parser={(text) => (/^\d+$/.test(text) ? text : 1)}
                    onChange={(e) => {
                      setAmount(e);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="password"
                  label={<div style={{}}>口令</div>}
                  rules={[
                    {
                      required: true,
                      message: "Please input password!",
                    },
                  ]}
                >
                  <Input
                    className=" border-gray-200"
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
            className="flex-1 h-10 rounded-full border  bg-slate-200  hover:bg-slate-300 text-slate-500 hover:text-slate-600 text-sm font-semibold transition-colors mr-4"
            onClick={showDrawer}
          >
            CHOOSE COINS
          </button>
          <Button
            className="btn flex-1 h-10 rounded-full bg-slate-200  text-slate-500    text-sm font-semibold transition-colors disabled:bg-slate-100  disabled:text-gray-300 disabled:cursor-not-allowed border-none "
            disabled={Object.keys(chosedCoin).length == 0}
            onClick={send}
            loading={loading}
          >
            SEND
          </Button>
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

      <RpList ref={rpListChild} />
    </div>
  );
}
