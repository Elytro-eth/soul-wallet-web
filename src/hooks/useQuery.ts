/**
 * Query data on chain
 */

import useWalletContext from '../context/hooks/useWalletContext';
import BN from 'bignumber.js';
import { ethers } from 'ethers';
import useSdk from './useSdk';
import { addPaymasterData, printUserOp } from '@/lib/tools';
import useConfig from './useConfig';
import { useSignerStore } from '@/store/signer';
import { useBalanceStore } from '@/store/balance';

export default function useQuery() {
  const { ethersProvider } = useWalletContext();
  const { soulWallet } = useSdk();
  const { chainConfig } = useConfig();
  const { getSelectedKeyType } = useSignerStore();

  const getEthPrice = async () => {
    // get price from coingecko
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    console.log('res', await res.json());
    return await res.json();
  };

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
  const set1559Fee = async (userOp: any, payToken: string) => {
    const selectedKeyType = getSelectedKeyType();

    console.log('selectedkeytype,', selectedKeyType)

    // set 1559 fee
    if (!userOp.maxFeePerGas || !userOp.maxPriorityFeePerGas) {
      const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();
      userOp.maxFeePerGas = maxFeePerGas;
      userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
    }

    if (payToken && payToken !== ethers.ZeroAddress) {
      userOp.paymasterData = addPaymasterData(payToken, chainConfig.contracts.paymaster);
    }

    console.log('Estimate UserOP:')
    printUserOp(userOp);

    // get gas limit
    const gasLimit = await soulWallet.estimateUserOperationGas(chainConfig.contracts.defaultValidator, userOp, selectedKeyType);

    if (gasLimit.isErr()) {
      throw new Error(gasLimit.ERR.message);
    }

    return userOp;
  };

  // const getWalletType = async (address: string) => {
  //     if (!verifyAddressFormat(address)) {
  //         return "";
  //     }
  //     const contractCode = await ethersProvider.getCode(address);
  //     return contractCode !== "0x" ? "contract" : "eoa";
  // };

  const refreshActivateStatus = () => {
    // refresh all activate status on specific chain
  };

  return {
    getGasPrice,
    getPrefund,
    set1559Fee,
  };
}
