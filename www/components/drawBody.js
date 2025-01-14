import {
  useSignTransactionBlock,
  useSuiClient,
  useCurrentAccount,
  ConnectModal,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useCoinBalances } from "@/lib/useUserBalance";
const DrawBody = () => {
  const client = useSuiClient();
  const [coinTypes, setCoinTypes] = useState([]);
  const [coinInfo, setCoinInfo] = useState({});
  const [editStates, setEditStates] = useState([]); // 存储每个元素是否处于编辑状态
  const currentAccount = useCurrentAccount();

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
        console.log(res);

        setCoinInfo((prevDecimals) => {
          let data = { ...prevDecimals };
          data[item.type] = { ...res };
          return data;
        });
      });
    };
    getAllCoinInfo();
    setEditStates(coinTypes.map(() => false))
  }, [coinTypes]);

  useEffect(() => {
    console.log(coinInfo);
    console.log(coinTypes);
  }, [coinInfo]);

    // 切换到编辑模式
    
  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      {/* 标题 */}
      <div className="text-4xl font-extrabold mb-4">Choose coins</div>
      {/* 选择栏 */}
      <div className="w-full   bg-slate-100 rounded-3xl p-4">
        {coinTypes.map((item, index) => {
          return (
            <div
              className="w-full h-16  flex justify-start items-center border-b-[1px] last:border-0 mt-4 pb-4 first:mt-0 last:pb-0"
              key={item.fullType}
            >
              {/* icon图 */}
             
              <div
                style={{
                  backgroundImage: `url(${coinInfo[item.type]?.iconUrl})`,
                }}
                className={`bg-no-repeat  bg-center bg-cover h-14 w-14 mr-3`}
              ></div>
              <div className="h-14 flex-grow flex flex-col justify-around">
                {/* 标题 */}
                {editStates[index] ? (
                  <input
                    type="text"
                    placeholder={item.type}
                    autoFocus
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <div className="text-xl font-bold cursor-pointer"  onClick={() => handleEdit(index)} >{item.type}</div>
                )}

                {/* 余额 */}
                <div className="text-sm text-gray-500">1234.56789 HUSKI</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DrawBody;
