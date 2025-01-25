import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { TESTNET_REDPACKSTORE_OBJECT_ID } from "@/components/networkConfig.js";
import Link from "next/link";

const RpList = () => {
  const [rpIdList, setRpIdList] = useState([]); //id列表
  const [rpList, setRpList] = useState([]); // 红包列表对象
  const account = useCurrentAccount();
  const client = useSuiClient();

  // 获取rc信息，信息中包含了红包的id列表
  useEffect(() => {
    const getRcinfo = async () => {
      const { data } = await client.getDynamicFields({
        parentId: TESTNET_REDPACKSTORE_OBJECT_ID,
      });
      const idList = data.map((item) => {
        return item.objectId;
      });

      setRpIdList(idList);
    };
    getRcinfo();
  }, []);

  //    获取红包列表
  useEffect(() => {
    const getRpList = async () => {
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
        return (
          <Link href={`/receive/${item.objectId}`} key={item.objectId}>
            <div className="w-36 h-44  m-2 rounded-2xl shadow-lg bg-slate-50"></div>
          </Link>
        );
      })}
    </div>
  );
};

export default RpList;
