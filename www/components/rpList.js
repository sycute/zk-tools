import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { TESTNET_REDPACKSTORE_OBJECT_ID } from "@/components/networkConfig.js";
import Link from "next/link";
import { truncateString } from "@/utils/util.js";

const RpList = forwardRef((props, ref) => {
  const [rpIdList, setRpIdList] = useState([]); //id列表
  const [rpList, setRpList] = useState([]); // 红包列表对象
  const account = useCurrentAccount();
  const client = useSuiClient();

  // 获取rc信息，信息中包含了红包的id列表
  const getRcinfo = async () => {
    console.log(123);

    const { data } = await client.getDynamicFields({
      parentId: TESTNET_REDPACKSTORE_OBJECT_ID,
    });
    const idList = data.map((item) => {
      return item.objectId;
    });

    setRpIdList(idList);
  };

  // 暴露方法给父组件调用
  useImperativeHandle(ref, () => ({
    getRcinfo,
  }));
  useEffect(() => {
    getRcinfo();
  }, []);

  //    获取红包列表
  useEffect(() => {
    const getRpList = async () => {
      console.log(456);
      const res = await client.multiGetObjects({
        ids: rpIdList,
        options: { showContent: true },
      });

      const rpList = res.map((item) => {
        return item.data;
      });
      setRpList(rpList);
      console.log(rpList);
    };
    getRpList();
  }, [rpIdList]);

  {
    /* 红包列表 */
  }
  return (
    <div className="mt-12 flex w-3/4 max-w-[800px] mx-auto flex-wrap justify-start ">
      {rpList.map((item) => {
        let fields = item.content.fields;
        return (
          <Link href={`/receive/${item.objectId}`} key={item.objectId}>
            <div className="w-44 h-52 m-3 p-2 rounded-2xl shadow-lg bg-slate-50">
              <div className="text-center ">
                <div className="text-3xl font-bold mb-2">
                  {fields?.nums - fields?.claimers.length}/{fields?.nums}
                </div>
              </div>
              {/* 其他信息 */}
              <div>
                <div className="text-center mb-1">
                  <div className="text-xs text-gray-500">Total Balance</div>
                  <div className="text-lg font-semibold">{fields.balance}</div>
                </div>

                <div className="text-center mb-1">
                  <div className="text-sm text-gray-500 ">Packet Id</div>
                  <div className="text-base font-medium text-gray-800 font-mono">
                    {truncateString(item.objectId)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500">Sender</div>
                  <div className="text-base font-medium text-gray-800 font-mono">
                    {truncateString(fields.sender)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
});

export default RpList;
