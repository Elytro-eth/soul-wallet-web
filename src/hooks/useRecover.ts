import { MaxUint256, ZeroAddress, ZeroHash, ethers, parseEther } from 'ethers';
import { SignkeyType, SocialRecovery, Transaction, UserOperation } from '@soulwallet/sdk';
import api from '@/lib/api';
import useWallet from './useWallet';
import { useToast } from '@chakra-ui/react';

export default function useRecover() {
  const { getChangeGuardianOp, signAndSend } = useWallet();
  const toast = useToast();
  const doBackupGuardian = async (
    guardians: string[],
    guardianNames: string[],
    threshold: number,
    guardianHash: string,
  ) => {
    try {
      const res = await api.backup.publicBackupGuardians({
        guardianHash: guardianHash,
        guardianDetails: {
          guardians: guardians,
          threshold: guardians.length ? threshold : 0,
          salt: ZeroHash,
        },
      });
      console.log('backup result', res);
      // private backup guardian names
      let guardianWithMarks = [];
      for (let i = 0; i < guardians.length; i++) {
        guardianWithMarks.push({
          guardianAddress: guardians[i],
          mark: guardianNames[i],
        });
      }
      const privateRes = await api.authenticated.saveGuardianInfo({
        guardians: guardianWithMarks.filter((g) => g.mark),
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to backup guardians',
        status: 'error',
      });
    }
  };

  const doSetGuardians = async (guardians: string[], guardianNames: string[], threshold: number) => {
    try {
      const newGuardianHash = SocialRecovery.calcGuardianHash(guardians, threshold);

      await doBackupGuardian(guardians, guardianNames, threshold, newGuardianHash);

      const userOp = await getChangeGuardianOp(newGuardianHash);
      // 5. execute op
      const res = await signAndSend(userOp);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to set guardians',
        status: 'error',
      });
    }
  };

  return {
    doSetGuardians,
  };
}
