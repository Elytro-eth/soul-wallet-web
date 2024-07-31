/**
 * Goerli
 */

import IconEthFaded from '@/assets/chains/eth-faded.svg';
import IconEthSquare from '@/assets/chains/eth-square.svg';

const chainId = 11155111

export default {
  icon: IconEthSquare,
  iconFaded: IconEthFaded,
  iconSquare: IconEthSquare,
  /**
   * TODO, find new provider
   */
  provider: ``,
  mainnetProvider: `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_.VITE_ALCHEMY_KEY}`,
  scanUrl: 'https://sepolia.etherscan.io',
  scanName: 'Etherscan',
  bundlerUrl: `https://api-dev.stable.cash/bundler/eth-sepolia/rpc`,
  maxCostMultiplier: 110,
  chainId,
  chainPrefix: 'sep:',
  chainColor: 'black',
  chainIdHex: `0x${(chainId).toString(16)}`,
  defaultMaxFee: '1700000000',
  defaultMaxPriorityFee: '1500000000',
  chainName: 'Sepolia',
  chainToken: 'ETH',
  paymasterTokens: [
    // test u
    '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  ],
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
  },
};
