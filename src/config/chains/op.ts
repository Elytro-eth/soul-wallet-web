/**
 * Arbitrum Sepolia
 */

import IconOpFaded from '@/assets/chains/op-faded.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';

const chainId = 10;

export default {
  icon: IconOpSquare,
  iconFaded: IconOpFaded,
  iconSquare: IconOpSquare,
  provider: `https://mainnet.optimism.io`,
  mainnetProvider: `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
  scanUrl: 'https://optimistic.etherscan.io',
  scanName: 'Etherscan',
  bundlerUrl: `${import.meta.env.VITE_BACKEND_URL}/walletapi/bundler/optimism/rpc`,
  maxCostMultiplier: 120,
  chainId,
  // chainPrefix: 'oeth:',
  chainPrefix: 'op:',
  chainPrefixOther: "oeth:",
  chainColor: '#E94E57',
  chainIdHex: `0x${(chainId).toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Optimism',
  chainToken: 'ETH',
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
    socialRecoveryModule: import.meta.env.VITE_SocialRecoveryModule,
  },
};
