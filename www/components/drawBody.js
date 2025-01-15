"use client";
import {
  useSignTransactionBlock,
  useSuiClient,
  useCurrentAccount,
  ConnectModal,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useCoinBalances } from "@/lib/useUserBalance";
import { Button, Checkbox, Form, Input } from "antd";
const DrawBody = () => {
  const client = useSuiClient();
  const [coinTypes, setCoinTypes] = useState([]);
  const [coinInfo, setCoinInfo] = useState({});
  const [editStates, setEditStates] = useState([]); // 存储每个元素是否处于编辑状态
  const currentAccount = useCurrentAccount();
  const [form] = Form.useForm();
  useEffect(() => {
    const getTypes = async () => {
      // 获取所有CoinType
      if (!currentAccount?.address) return;
      const res = await client.getAllBalances({
        owner: currentAccount?.address,
      });
      let types = [];
      res.forEach((item) => {
        types.push({
          fullType: item.coinType,
          type: item.coinType.split("::")[2],
          balance: item.totalBalance,
        });
      });
      setCoinTypes(types);
    };
    getTypes();
  }, [currentAccount?.address]);

  // 根据币种类型获取精度
  useEffect(() => {
    const getCoinInfo = async (type) => {
      const res = await client.getCoinMetadata({
        coinType: type,
      });
      return res;
    };

    const getAllCoinInfo = () => {
      if (!currentAccount?.address) return;
      if (!coinTypes.length) return;
      coinTypes.forEach(async (item) => {
        const res = await getCoinInfo(item.fullType);

        setCoinInfo((prevDecimals) => {
          let data = { ...prevDecimals };
          data[item.type] = { ...res };
          return data;
        });
      });
    };
    getAllCoinInfo();
    setEditStates(coinTypes.map(() => false));
  }, [coinTypes]);

  //   useEffect(() => {
  //     console.log(coinInfo);
  //     console.log(coinTypes);
  //   }, [coinInfo]);

  // 切换到编辑模式
  const handleEdit = (index) => {
    setEditStates((prev) =>
      prev.map((editState, i) => (i === index ? true : editState))
    );
  };
  function checkNaN(value) {
    return Number.isNaN(value) ? 0 : value;
  }
  // 手动触发验证
  const handleBlur = () => {
    form.validateFields();
  };
  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      {/* 标题 */}
      <div className="text-4xl font-extrabold mb-4">Choose coins</div>
      {/* 选择栏 */}
      <div className="w-full   bg-slate-100 rounded-3xl p-4">
        <Form>
          {coinTypes.map((item, index) => {
            console.log(
              typeof (item?.balance - 0) /
                10 ** coinInfo[item.type]?.decimals ==
                "NaN"
            );

            return (
              <div
                className="w-full  flex justify-start items-center border-b-[1px] last:border-0 mt-4 pb-6 first:mt-0 last:pb-0"
                key={item.fullType}
              >
                {/* icon图 */}

                <div
                  style={{
                    backgroundImage: `url(${coinInfo[item.type]?.iconUrl})`,
                  }}
                  className={`bg-no-repeat  bg-center bg-cover h-14 w-14 mr-3`}
                ></div>

                <div className="h-14 flex-grow flex flex-col justify-start">
                  {/* 标题 */}
                  {editStates[index] ? (
                    <Form.Item
                      name={item.type}
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                      className="mb-3"
                    >
                      <Input onBlur={handleBlur} />
                    </Form.Item>
                  ) : (
                    <div
                      className="text-xl font-bold cursor-pointer"
                      onClick={() => handleEdit(index)}
                    >
                      {item.type}
                    </div>
                  )}

                  {/* 余额 */}
                  <div className="text-sm text-gray-500">
                    {checkNaN(
                      (item.balance - 0) / 10 ** coinInfo[item.type]?.decimals
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Form>
      </div>
    </div>
  );
};
export default DrawBody;
