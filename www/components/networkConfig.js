import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
export const TESTNET_ZKREDPACK_PACKAGE_ID =
  "0xd881a399b170c8a0af91053bd26824281b19d65f0cdbdc4dc6f23586a3f6fe8d";

export const TESTNET_REDPACKSTORE_OBJECT_ID =
  "0x80011863aba3e88fb5f975ef124bd3bf3340398625a9372b52d583d012bcac17";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        zkRedpackPackageId: TESTNET_ZKREDPACK_PACKAGE_ID,
        testnetRedpackStoreObjectId: TESTNET_REDPACKSTORE_OBJECT_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
