/**
 * Query data on chain
 */

import useWalletContext from '../context/hooks/useWalletContext';
import BN from 'bignumber.js';
import { Contract, ZeroAddress, ZeroHash, ethers } from 'ethers';
import useSdk from './useSdk';
import useConfig from './useConfig';
import api from '@/lib/api';
import { ABI_SocialRecoveryModule } from '@soulwallet/abi';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { useSettingStore } from '@/store/setting';

export default function useQuery() {
  const { ethersProvider } = useWalletContext();
  const { soulWallet } = useSdk();
  const { chainConfig } = useConfig();
  const { selectedChainId } = useChainStore();
  const { saveGuardianAddressEmail } = useSettingStore();

  const checkEmailGuardians = async (guardians: []) => {
    // check if there's email guardian
    const res2: any = await api.emailGuardian.guardianInfo({
      guardians: guardians,
      chainID: selectedChainId,
    });

    if (res2 && res2.data && res2.data.guardians && res2.data.guardians.length) {
      res2.data.guardians.forEach((item: any) => {
        saveGuardianAddressEmail(item.guardianAddress, item.email);
      });
    }
  };

  const getGuardianDetails = async (walletAddress: string) => {
    const contract = new Contract(chainConfig.contracts.socialRecoveryModule, ABI_SocialRecoveryModule, ethersProvider);
    const recoveryInfo = await contract.getSocialRecoveryInfo(walletAddress);
    const activeGuardianHash = recoveryInfo[0];
    if (activeGuardianHash === ZeroHash) {
      return null;
    }
    const res = await api.guardian.getGuardianDetails({ guardianHash: activeGuardianHash });
    await checkEmailGuardians(res.data.guardian_info.guardians);
    return res.data;
  };

  const getRecoverRecord = async (recoveryId: string) => {
    const res = await api.guardian.getRecoverRecord({ recoveryID: recoveryId });
    await checkEmailGuardians(res.data.guardian_info.guardians);
    return res.data;
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

  return {
    getGasPrice,
    getPrefund,
    getGuardianDetails,
    getRecoverRecord,
  };
}
