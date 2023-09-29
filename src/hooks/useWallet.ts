import useWalletContext from '../context/hooks/useWalletContext';
import useKeyring from './useKeyring';
import { ethers } from 'ethers';
import useSdk from './useSdk';
import { SoulWallet } from '@soulwallet_test/sdk';
import { useAddressStore } from '@/store/address';
import useQuery from './useQuery';
import { ABI_SoulWallet } from '@soulwallet_test/abi';
import { useGuardianStore } from '@/store/guardian';
import { addPaymasterAndData } from '@/lib/tools';
import useKeystore from './useKeystore';
import Erc20ABI from '../contract/abi/ERC20.json';
import { UserOpUtils, UserOperation } from '@soulwallet_test/sdk';
import useConfig from './useConfig';
import { useChainStore } from '@/store/chain';
import bg from '@/background';
import usePasskey from './usePasskey';
import { useCredentialStore } from '@/store/credential';

export default function useWallet() {
  const { account } = useWalletContext();
  const { toggleActivatedChain } = useAddressStore();
  const { calcGuardianHash } = useKeystore();
  const { selectedChainId } = useChainStore();
  const { sign } = usePasskey();
  const { getFeeCost, getPrefund } = useQuery();
  const { chainConfig } = useConfig();
  const { guardians, threshold, slotInitInfo } = useGuardianStore();
  const { credentials } = useCredentialStore();
  const keystore = useKeyring();
  const { soulWallet } = useSdk();

  const activateWallet = async (index: number, payToken: string, estimateCost: boolean = false) => {
    const { initialKeys, initialGuardianHash } = slotInitInfo;
    const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(index, initialKeys, initialGuardianHash);

    if (userOpRet.isErr()) {
      throw new Error(userOpRet.ERR.message);
    }

    let userOp = userOpRet.OK;

    // approve paymaster to spend ERC-20
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    const erc20Abi = new ethers.Interface(Erc20ABI);
    const to = chainConfig.paymasterTokens;
    const approveCalldata = erc20Abi.encodeFunctionData('approve', [
      chainConfig.contracts.paymaster,
      ethers.parseEther('1000'),
    ]);

    // const transferData = {
    //   to: '',
    //   data: '0x',
    // }

    const approveCalldatas = [...new Array(to.length)].map(() => approveCalldata);

    // const finalCalldata = [
    //   ...approveCalldata,
    //   ...[
    //     {
    //       to: '',
    //       data: '',
    //     },
    //     transferData.data,
    //   ],
    // ]

    const callData = soulAbi.encodeFunctionData('executeBatch(address[],bytes[])', [to, approveCalldatas]);

    userOp.callData = callData;

    userOp.callGasLimit = `0x${(50000 * to.length + 1).toString(16)}`;

    const feeCost = await getFeeCost(userOp, payToken);

    userOp = feeCost.userOp;

    if (estimateCost) {
      const { requiredAmount } = await getPrefund(userOp, payToken);
      return requiredAmount;
    } else {
      // TODO, estimate fee could be avoided
      await signAndSend(userOp, payToken);
      // IMPORTANT TODO, what if user don't wait?
      toggleActivatedChain(userOp.sender, selectedChainId);
    }
  };

  const getSetGuardianCalldata = async (slot: string, guardianHash: string, keySignature: string) => {
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    return soulAbi.encodeFunctionData('setGuardian(bytes32,bytes32,bytes32)', [slot, guardianHash, keySignature]);
  };

  const getSignature = async (packedHash: string, validationData: string) => {
    // IMPORT TODO, use the first credential for now
    const credentialIndex = 0;
    const signatureData = await sign(credentials[credentialIndex], packedHash);

    const packedSignatureRet = await soulWallet.packUserOpP256Signature(signatureData, validationData);

    if (packedSignatureRet.isErr()) {
      throw new Error(packedSignatureRet.ERR.message);
    }

    return packedSignatureRet.OK;
  };

  const signAndSend = async (userOp: UserOperation, payToken?: string) => {
    // checkpaymaster
    if (payToken && payToken !== ethers.ZeroAddress && userOp.paymasterAndData === '0x') {
      const paymasterAndData = addPaymasterAndData(payToken, chainConfig.contracts.paymaster);
      userOp.paymasterAndData = paymasterAndData;
    }

    const validAfter = Math.floor(Date.now() / 1000);
    const validUntil = validAfter + 3600;

    const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

    if (packedUserOpHashRet.isErr()) {
      throw new Error(packedUserOpHashRet.ERR.message);
    }
    const packedUserOpHash = packedUserOpHashRet.OK;

    userOp.signature = await getSignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);

    return await bg.execute(userOp, chainConfig);
  };

  const signRawHash = async (hash: string) => {
    // default valid time
    const validAfter = Math.floor(Date.now() / 1000);
    const validUntil = validAfter + 3600;
    const packedHashRet = await soulWallet.packRawHash(hash, validAfter, validUntil);
    if (packedHashRet.isErr()) {
      throw new Error(packedHashRet.ERR.message);
    }
    const packedHash = packedHashRet.OK;
    const signature = await getSignature(packedHash.packedHash, packedHash.validationData);
    console.log('hash is', hash, signature);
    return signature;
  };

  return {
    addPaymasterAndData,
    activateWallet,
    getSetGuardianCalldata,
    signAndSend,
    signRawHash,
  };
}
