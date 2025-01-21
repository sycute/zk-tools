// 获取一种类型的所有硬币列表
export const getCoins = async (client, currentAccount, coinType) => {
  const { data } = await client.getCoins({
    owner: currentAccount?.address,
    coinType: coinType,
  });

  return data;
};

export const combineCoins = async (txb,coins, coinType) => {
  if (coins.length < 2) return;
  let idList = coins.map((i) => {
    console.log(i.coinObjectId);
    
    return i.coinObjectId;
  });

  for (let i = 1; i < idList.length-2; i++) {
    txb.moveCall({
      target: "0x2::coin::join",
      arguments: [txb.object(idList[0]), txb.object(idList[i])],
      typeArguments: [coinType],
    });
  }
};

export const splitCoins = async (txb,coin, coinType, amount, decimals) => {
  console.log(coin, coinType, amount, decimals);

  const given_coin = txb.moveCall({
    target: "0x2::coin::split",
    arguments: [
      txb.object(coin.coinObjectId),
      txb.pure(amount * 10 ** decimals),
    ],
    typeArguments: [coinType],
  });

  return given_coin;
};

export const intoBalance = (txb,given_coin, coinType) => {
  const given_balance = txb.moveCall({
    target: "0x2::coin::into_balance",
    arguments: [txb.object(given_coin)],
    typeArguments: [coinType],
  });
  return given_balance;
};
