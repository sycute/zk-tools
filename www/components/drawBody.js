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
import { Button, Checkbox, Form, Input, InputNumber } from "antd";
const DrawBody = (props) => {
  const client = useSuiClient();
  const [coinTypes, setCoinTypes] = useState([]);
  const [coinInfo, setCoinInfo] = useState({});
  const [editStates, setEditStates] = useState([]); // 存储每个元素是否处于编辑状态
  const [chosedCoin, setChosedCoin] = useState({});
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
          data[item.type] = { ...res, fullType: item.fullType };
          return data;
        });
      });
    };
    getAllCoinInfo();
    setEditStates(coinTypes.map(() => false));
  }, [coinTypes]);

  // 当coinInfo改变时传递到父组件
  useEffect(() => {
    props.getCoinInfo(coinInfo);

  }, [coinInfo]);

  // 切换到编辑模式
  const handleEdit = (index) => {
    // 将正在编辑的选项改为true，其余改为false
    setEditStates((prev) =>
      prev.map((editState, i) => (i === index ? true : false))
    );
  };
  // 手动触发验证
  const handleBlur = () => {
    
    // form.validateFields();
  };

  // 取消
  const cancel = () => {
    console.log("取消");
  };

  const submit = () => {
     // 将值传给父组件
     props.getChosedCoin(chosedCoin);
     props.setOpen(false);
  };

  const handleChange = (type, value) => {
    // 保存数据
    const chosed = { [type]: value };
    // 更新本地数值
    setChosedCoin(chosed);
  };

  //   多位小数处理
  function getFullNum(num) {
    //处理非数字
    if (isNaN(num)) {
      return num;
    }
    //处理不需要转换的数字
    var str = "" + num;
    if (!/e/i.test(str)) {
      return num;
    }
    return num.toFixed(20).replace(/\.?0+$/, "");
  }
  function checkNaN(value) {
    return Number.isNaN(value) ? 0 : value;
  }
  return (
    <div className="w-full h-full flex flex-col justify-start items-center relative">
      {/* 标题 */}
      <div className="text-4xl font-extrabold mb-4">Choose coins</div>
      {/* 选择栏 */}
      <div className="w-full   bg-slate-100 rounded-3xl p-4">
        <Form form={form}>
          {coinTypes.map((item, index) => {
            function getMax() {
              const balance = checkNaN(
                (item?.balance - 0) / 10 ** coinInfo[item.type]?.decimals
              );
              console.log(balance);
              return balance;
            }

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
                  <div className="h-8 mb-4">
                    {editStates[index] ? (
                      <Form.Item
                        name={item.type}
                        rules={[
                          {
                            required: true,
                            message: "Please input number!",
                          },
                          {
                            max: getMax(),
                            transform: (value) => Number(value),
                            message: "Amount exceeds maximum available balance",
                          },
                          {
                            min: 0,
                            transform: (value) => Number(value),
                            message: "Invalid amount",
                          },
                        ]}
                        className="mb-3 m-0 p-0"
                      >
                        <InputNumber
                          className="w-full"
                          onChange={(e) => {
                            handleChange(item.type, e);
                          }}
                          onBlur={handleBlur}
                          autoFocus
                        />
                      </Form.Item>
                    ) : (
                      <div
                        className="text-xl font-bold cursor-pointer"
                        onClick={() => handleEdit(index)}
                      >
                        {item.type}
                      </div>
                    )}
                  </div>

                  {/* 余额 */}
                  <div className="text-sm text-gray-500">
                    {getFullNum(
                      checkNaN(
                        (item.balance - 0) / 10 ** coinInfo[item.type]?.decimals
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Form>
      </div>

      {/* 底部按钮 */}
      <div className="w-full flex justify-center items-center absolute bottom-4">
        <button
          className="flex-1 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium transition-colors mr-4"
          onClick={cancel}
        >
          CANCEL
        </button>
        <button
          className="flex-1 h-10 rounded-full bg-black hover:bg-black/90 text-white text-sm font-medium transition-colors"
          onClick={submit}
        >
          DONE
        </button>
      </div>
    </div>
  );
};
export default DrawBody;
