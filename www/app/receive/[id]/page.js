"use client";
import { useEffect, use, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { truncateString } from "@/utils/util.js";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  message,
} from "antd";
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
  const [loading, setLoading] = useState(false); // 加载状态
  const account = useCurrentAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const router = useRouter()
  // 从 params 中获取动态路由参数
  const { id } = use(params);
  const client = useSuiClient();
  const executeTx = useTransactionExecution();
  // 根据id获取红包数据
  const getRpInfo = async () => {
    const { data } = await client.getObject({
      id,
      options: { showContent: true },
    });
    console.log(data);
    // 红包已被全部领取，对象为空

    if(!data){
      setRpInfo(null);
      return;
    }
    setRpInfo(data.content.fields);
    const str = data.content.type;
    const match = str.match(/<([^>]+)>/);
    const result = match ? match[1] : "";
    setFullType(result);
  };
  useEffect(() => {
    getRpInfo();
  }, []);

  const handleClaim = () => {
    if (!account) return alert("请先连接钱包");
    // 校验表单
    form
      .validateFields()
      .then(async () => {
        console.log("领取中...");
        setLoading(true);
        try {                                                                                                                             
          // 获取密码
          const { data: encryptedPassword } = await axios.get(
            `https://psw-gift-2xvg.shuttle.app/zkrpclaim?g=${passWord}&e=${rpInfo.proof_inputs}`
          );
          console.log("encryptedPassword==>",encryptedPassword);

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
          let res = await executeTx(txb);

          if(res){
            messageApi.open({
              type: "success",
              content: "claimed successfully!",
              duration: 0,
            });
            // 返回主页
            // router.push('/')
          }else{
            messageApi.error({
              type: "error",
              content: "claimed failed!",
            });
          }
          setLoading(false);
          // 更新数据
          setTimeout(() => {
            getRpInfo();
          }, 1000);
        } catch (e) {
          console.error(e);
          setLoading(false);
          messageApi.error({
            type: "error",
            content: "claimed failed!",
          });
        }
      })
     
  };
  return (
    <div>
      {contextHolder}
      {/* 信息展示 */}
      <div className="min-h-screen  mx-2 rounded-2xl relative pb-56 pt-24">
        <div className="w-[400px] h-48 bg-slate-50 mx-auto mt-20 p-6   rounded-2xl shadow-lg text-center">
          {/* <div>id:{truncateString(rpInfo?.id.id)}</div>
          <div>balance:{rpInfo?.balance}</div>
          <div>sender:{truncateString(rpInfo?.sender)}</div>
          <div>{rpInfo.claimers.length}/nums</div> */}
          {rpInfo === null ? <div className="mt-14" >All red packet have been claimed</div> :  <div className="grid grid-cols-2 gap-6">
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
          </div>}
         
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
                  disabled={rpInfo === null}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                htmlType="submit"
                className="ml-2 border-none shadow-lg bg-slate-200"
                onClick={handleClaim}
                disabled={rpInfo === null}
                loading={loading}
              >
                Claim
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
