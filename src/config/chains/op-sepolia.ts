/**
 * Arbitrum Sepolia
 */

import IconOpFaded from '@/assets/chains/op-faded.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';
import IconOp from '@/assets/chains/op.svg';

const chainId = 11155420;

export default {
  icon: IconOp,
  iconFaded: IconOpFaded,
  iconSquare: IconOpSquare,
  provider: `https://sepolia.optimism.io`,
  mainnetProvider: `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
  scanUrl: 'https://sepolia-optimism.etherscan.io',
  scanName: 'Etherscan',
  bundlerUrl: `https://api-dev.soulwallet.io/walletapi/bundler/optimism-sepolia/rpc`,
  maxCostMultiplier: 120,
  chainId,
  chainPrefix: 'opsep:',
  chainIdHex: `0x${(chainId).toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Optimism Sepolia',
  chainToken: 'ETH',
  addressPrefix: "opsep:",
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
    socialRecoveryModule: import.meta.env.VITE_SocialRecoveryModule,
  },
};
