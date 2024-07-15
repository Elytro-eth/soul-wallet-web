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
  provider: `https://opt-mainnet.g.alchemy.com/v2/goJmtHHi_XBjXsLhpgRHwjkCd4rKy2ra`,
  scanUrl: 'https://optimistic.etherscan.io',
  scanName: 'Etherscan',
  bundlerUrl: `${import.meta.env.VITE_BACKEND_URL}/walletapi/bundler/optimism/rpc`,
  maxCostMultiplier: 120,
  chainId,
  chainPrefix: 'oeth:',
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
