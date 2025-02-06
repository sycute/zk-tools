"use client";
import { useEffect, use, useState } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { truncateString } from "@/utils/util.js";
import { Drawer, Form, Input, Row, Col, InputNumber, Button } from "antd";
import { useTransactionExecution } from "@/api/useTransactionExecution.js";
import { Transaction } from "@mysten/sui/transactions";
import {
  TESTNET_ZKREDPACK_PACKAGE_ID,
  TESTNET_REDPACKSTORE_OBJECT_ID,
} from "@/components/networkConfig.js";
import axios from "axios";
export default function UserPage({ params }) {
  const [rpInfo, setRpInfo] = useState();
  const [passWord, setPassWord] = useState(""); //口令
  const [fullType, setFullType] = useState(""); //红包类型

  const [form] = Form.useForm();
  // 从 params 中获取动态路由参数
  const { id } = use(params);
  const client = useSuiClient();
  const executeTx = useTransactionExecution();
  // 根据id获取红包数据
  useEffect(() => {
    const getRpInfo = async () => {
      const { data } = await client.getObject({
        id,
        options: { showContent: true },
      });
      console.log(data);
      setRpInfo(data.content.fields);
      const str = data.content.type;
      const match = str.match(/<([^>]+)>/);
      const result = match ? match[1] : "";
      setFullType(result);
    };
    getRpInfo();
  }, []);

  const handleClaim = () => {
    // 校验表单
    form
      .validateFields()
      .then(async () => {
        console.log("领取中...");
        // 获取密码
        // https://psw-gift-2xvg.shuttle.app/zkrpclaim?g=sam&e=01000000000000000fbd1d3ac37b96e52be719a10ff37d53ccfb7f21313e3dd47f5b3915ca173809
        const { data: encryptedPassword } = await axios.get(
          `https://psw-gift-2xvg.shuttle.app/zkrpclaim?g=${passWord}&e=${rpInfo.proof_inputs}`
        );
        console.log(encryptedPassword);

        // 执行领取逻辑
        let txb = new Transaction();

        // 领取
        txb.moveCall({
          target: `${TESTNET_ZKREDPACK_PACKAGE_ID}::happyrp::claim`,
          arguments: [
            txb.object(TESTNET_REDPACKSTORE_OBJECT_ID),
            txb.object(id),
            txb.object("0x8"),
            txb.pure.string(encryptedPassword),
          ],
          typeArguments: [fullType],
        });

        // 执行
        let res = executeTx(txb);
        console.log(res);
      })
      .catch((e) => {
        console.error(e);
      });

    console.log("领取");
  };
  return (
    <div>
      {/* 信息展示 */}
      <div className="min-h-screen  mx-2 rounded-2xl relative pb-56 pt-24">
        <div className="w-[400px] h-48 bg-slate-50 mx-auto mt-48 p-6   rounded-2xl shadow-lg text-center">
          {/* <div>id:{truncateString(rpInfo?.id.id)}</div>
          <div>balance:{rpInfo?.balance}</div>
          <div>sender:{truncateString(rpInfo?.sender)}</div>
          <div>{rpInfo.claimers.length}/nums</div> */}
          <div className="grid grid-cols-2 gap-6">
            {/* 重点数据 */}
            <div className="space-y-1">
              <div className="text-3xl font-semibold">{rpInfo?.balance}</div>
              <div className="text-sm text-gray-500">Total Balance</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-semibold">
                {rpInfo?.nums - rpInfo?.claimers.length}/{rpInfo?.nums}
              </div>
              <div className="text-sm text-gray-500">Packet Remain</div>
            </div>

            {/* 次要数据 */}
            <div className="space-y-1">
              <div className="text-base text-gray-600">
                {truncateString(rpInfo?.id.id)}
              </div>
              <div className="text-sm text-gray-500">Packet Id</div>
            </div>
            <div className="space-y-1">
              <div className="text-base text-gray-600">
                {truncateString(rpInfo?.sender)}
              </div>
              <div className="text-sm text-gray-500">Sender</div>
            </div>
          </div>
        </div>
        {/* 口令输入框 */}
        <Form form={form} className="w-[400px] mx-auto mt-4">
          <Row>
            <Col span={20}>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input password!",
                  },
                ]}
              >
                <Input
                  className="border-gray-500 border-none shadow-lg"
                  placeholder="输入口令"
                  onChange={(e) => {
                    setPassWord(e.target.value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                htmlType="submit"
                className="ml-2 border-none shadow-lg bg-slate-200"
                onClick={handleClaim}
              >
                领取
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
