import { MaxUint256, ZeroAddress, ZeroHash, ethers, parseEther } from 'ethers';
import { SignkeyType, SocialRecovery, Transaction, UserOperation } from '@soulwallet/sdk';
import api from '@/lib/api';
import useWallet from './useWallet';

export default function useRecover() {
  const { getChangeGuardianOp, signAndSend } = useWallet();
  const doBackupGuardian = async (
    guardians: string[],
    guardianNames: string[],
    threshold: number,
    guardianHash: string,
  ) => {
    // public backup
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
      guardians: guardianWithMarks,
    });
  };

  const doSetGuardians = async (guardians: string[], guardianNames: string[], threshold: number) => {
    // 2. calc guardian hash
    const newGuardianHash = SocialRecovery.calcGuardianHash(guardians, threshold);

    // 3. backup guardian
    await doBackupGuardian(guardians, guardianNames, threshold, newGuardianHash);

    // 4. get user op
    const userOp = await getChangeGuardianOp(newGuardianHash);
    // 5. execute op
    const res = await signAndSend(userOp);
  };

  return {
    doSetGuardians,
  };
}
