/**
 * Query data on chain
 */

import useWalletContext from '../context/hooks/useWalletContext';
import BN from 'bignumber.js';
import { ethers } from 'ethers';
import useSdk from './useSdk';
import useConfig from './useConfig';

export default function useQuery() {
  const { ethersProvider } = useWalletContext();
  const { soulWallet } = useSdk();
  const { chainConfig } = useConfig();

  const getGasPrice = async () => {
    // if it's in the fixed price list, set fixed
    // if (chainConfig.chainId === 421613 || chainConfig.chainId === 42161) {
    //   return {
    //     maxFeePerGas: `0x${ethers.parseUnits(chainConfig.defaultMaxFee, 'gwei').toString(16)}`,
    //     maxPriorityFeePerGas: `0x${ethers.parseUnits(chainConfig.defaultMaxPriorityFee, 'gwei').toString(16)}`,
    //   };
    // }
    // TODO, get gas price from market
    const feeData = await ethersProvider.getFeeData();
    if (chainConfig.support1559) {
      return {
        maxFeePerGas: `0x${feeData.maxFeePerGas?.toString(16)}`,
        maxPriorityFeePerGas: `0x${feeData.maxPriorityFeePerGas?.toString(16)}`,
      };
    } else {
      return {
        maxFeePerGas: `0x${feeData.gasPrice?.toString(16)}`,
        maxPriorityFeePerGas: `0x${feeData.gasPrice?.toString(16)}`,
      };
    }
  };

  const getPrefund = async (userOp: any, payToken: string) => {
    // get preFund
    const preFund = await soulWallet.preFund(userOp);

    console.log('prefund', preFund);

    if (preFund.isErr()) {
      throw new Error(preFund.ERR.message);
    }

    const requiredEth = BN(preFund.OK.missfund).shiftedBy(-18);
    // erc20
    if (payToken === ethers.ZeroAddress) {
      return {
        requiredAmount: requiredEth.toFixed(),
        userOp,
      };
    } else {
      // important todo, should get decimals here
      // const selectedToken = getTokenBalance(payToken);
      // const res = await getEthPrice();
      // console.log('11111 price', res);
      const erc20Price = 2000;
      return {
        requiredAmount: requiredEth.times(erc20Price).times(chainConfig.maxCostMultiplier).div(100).toFixed(),
        userOp,
      };
    }
  };

  return {
    getGasPrice,
    getPrefund,
  };
}
