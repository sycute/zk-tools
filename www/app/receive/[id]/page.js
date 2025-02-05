"use client";
import { useEffect, use, useState } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { truncateString } from "@/utils/util.js";
import { Drawer, Form, Input, Row, Col, InputNumber, Button } from "antd";

export default function UserPage({ params }) {
  const [rpInfo, setRpInfo] = useState();
  const [passWord, setPassWord] = useState(""); //口令
  const [form] = Form.useForm();
  // 从 params 中获取动态路由参数
  const { id } = use(params);
  const client = useSuiClient();
  // 根据id获取红包数据
  useEffect(() => {
    const getRpInfo = async () => {
      const { data } = await client.getObject({
        id,
        options: { showContent: true },
      });
      console.log(data);
      setRpInfo(data.content.fields);
    };
    getRpInfo();
  }, []);

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
              <div className="text-3xl font-semibold">{rpInfo?.nums-rpInfo?.claimers.length}/{rpInfo?.nums}</div>
              <div className="text-sm text-gray-500">Packet Remain</div>
            </div>

            {/* 次要数据 */}
            <div className="space-y-1">
              <div className="text-base text-gray-600">{truncateString(rpInfo?.id.id)}</div>
              <div className="text-sm text-gray-500">Packet Id</div>
            </div>
            <div className="space-y-1">
              <div className="text-base text-gray-600">{truncateString(rpInfo?.sender)}</div>
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
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                htmlType="submit"
                className="ml-2 border-none shadow-lg bg-slate-200"
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
