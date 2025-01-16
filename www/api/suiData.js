import { TransactionBlock } from "@mysten/sui.js/transactions";

const txb = new TransactionBlock();
// const txb2 = useSignTransactionBlock(); //也可以这样写

// 获取一种类型的所有硬币列表
export const getCoins = async (client,currentAccount,coinType) => {
  const { data } = await client.getCoins({
    owner: currentAccount?.address,
    coinType: coinType,
  });

  return data;
};

export const combineCoins = async (coins,coinType) => {
  if (coins.length < 2) return;
  let idList = coins.map((i) => {
    return i.coinObjectId;
  });

  for (let i = 1; i < idList.length - 1; i++) {
    txb.moveCall({
      target: "0x2::coin::join",
      arguments: [txb.object(idList[0]), txb.object(idList[i])],
      typeArguments: [coinType],
    });
  }
};
