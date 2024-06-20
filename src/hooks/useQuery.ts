/**
 * Query data on chain
 */
import BN from 'bignumber.js';
import { ethers, Contract, ZeroHash } from 'ethers';
import { ABI_SocialRecoveryModule } from '@soulwallet/abi';
import useSdk from './useSdk';
import useConfig from './useConfig';
import useWalletContext from '@/context/hooks/useWalletContext';
import api from '@/lib/api';
import { useSettingStore } from '@/store/setting';
import { useGuardianStore } from '@/store/guardian';

export default function useQuery() {
  const { soulWallet } = useSdk();
  const { chainConfig } = useConfig();
  const { guardiansInfo, setGuardiansInfo } = useGuardianStore();
  const { saveGuardianAddressEmail, saveGuardianAddressName, guardianAddressEmail, guardianAddressName } = useSettingStore();
  const { ethersProvider } = useWalletContext();

  const fetchGuardianInfo = async (walletAddress: string) => {
    const contract = new Contract(chainConfig.contracts.socialRecoveryModule, ABI_SocialRecoveryModule, ethersProvider);
    const recoveryInfo = await contract.getSocialRecoveryInfo(walletAddress);
    const activeGuardianHash = recoveryInfo[0];
    // if (activeGuardianHash === ZeroHash) {
    //   return null;
    // }
    const resPublic = await api.backup.publicGetGuardians({ guardianHash: activeGuardianHash });

    // resPublic.data.specialGuardians.forEach((item: any) => {
    //   if(!guardianAddressEmail[item.guardianAddress]){
    //     saveGuardianAddressEmail(item.guardianAddress, item.data.email);
    //   }
    // });

    setGuardiansInfo(resPublic.data);

    const resPrivate = await api.authenticated.getGuardianInfo(resPublic.data.guardianDetails.guardians);

    resPrivate.data.guardians.forEach((item: any) => {
      saveGuardianAddressName(item.guardianAddress, item.data.mark);
      saveGuardianAddressEmail(item.guardianAddress, item.data.email);
    });
  };

  const fetchPublicGuardianInfo = async (walletAddress: string) => {
    const contract = new Contract(chainConfig.contracts.socialRecoveryModule, ABI_SocialRecoveryModule, ethersProvider);
    const recoveryInfo = await contract.getSocialRecoveryInfo(walletAddress);
    const activeGuardianHash = recoveryInfo[0];
    return await api.backup.publicGetGuardians({ guardianHash: activeGuardianHash });
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
    getPrefund,
    fetchGuardianInfo,
    fetchPublicGuardianInfo,
  };
}
