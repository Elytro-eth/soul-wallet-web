import { MaxUint256, ZeroAddress, ZeroHash, ethers } from 'ethers';
import useSdk from './useSdk';
import useQuery from './useQuery';
import { ABI_SoulWallet } from '@soulwallet/abi';
import { useSlotStore } from '@/store/slot';
import { addPaymasterData } from '@/lib/tools';
import { erc20Abi, verifyMessage } from 'viem';
import { SignkeyType, UserOperation } from '@soulwallet/sdk';
import { executeTransaction } from '@/lib/tx';
import { UserOpUtils } from '@soulwallet/sdk';
import useConfig from './useConfig';
import api from '@/lib/api';
import usePasskey from './usePasskey';
import { toHex } from '@/lib/tools';
import { useSignerStore } from '@/store/signer';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { defaultGuardianSafePeriod } from '@/config';
// import { fetchTokenBalanceApi } from '@/store/balance';
// import useTransaction from './useTransaction';
import useTools from './useTools';
import BN from 'bignumber.js';
import useBrowser from './useBrowser';
import { useBalanceStore } from '@/store/balance';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useTempStore } from '@/store/temp';
import { useGuardianStore } from '@/store/guardian';

export default function useWallet() {
  const { signByPasskey, authenticate } = usePasskey();
  const { chainConfig } = useConfig();
  const { setSlotInfo, slotInfo } = useSlotStore();
  const { selectedChainId, setSelectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential, selectedKeyType } = useSignerStore();
  const { soulWallet } = useSdk();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { clearLogData } = useTools();
  const { setGuardiansInfo } = useGuardianStore();
  const { recoverInfo, clearTempStore } = useTempStore();
  const { selectedAddress, setWalletName, setAddressList } = useAddressStore();

  // will be executed only once after recover process finished
  const boostAfterRecovered = async (_recoverInfo: any) => {
    console.log('recover info is', _recoverInfo);
    setSlotInfo({
      ...recoverInfo.initInfo
    });
    setAddressList([
      {
        address: recoverInfo.recoveryRecord.address,
        chainIdHex: recoverInfo.recoveryRecord.chain_id,
        activated: true,
      },
    ]);
    const credentialsInStore = recoverInfo.signers.filter((signer: any) => signer.type === 'passkey');
    if (credentialsInStore.length) setCredentials(credentialsInStore);
    setSelectedChainId(_recoverInfo.chain_id);

    setGuardiansInfo({
      guardianHash: recoverInfo.guardian_hash,
      guardianDetails: recoverInfo.guardian_info,
    });

    clearTempStore();

    // navigate('/dashboard');
  };

  const loginWallet = async () => {
    const { credential } = await authenticate();
    try {
      const res: any = await api.account.list({
        ownerKey: credential.publicKey,
      });

      if (!res || !res.data || !res.data.length || res.code !== 200) {
        toast({
          title: 'Failed to login',
          description: res.msg,
          status: 'error',
          duration: 5000,
        });
        throw new Error('Failed to login');
      }

      // consider first item only for now
      const item = res.data[0];
      setCredentials([credential as any]);
      setWalletName(item.name);
      setAddressList([
        {
          address: item.address,
          chainIdHex: selectedChainId,
          // default set to true, will check later
          activated: true,
        },
      ]);
      setSelectedChainId(item.chainID);
      setSlotInfo(item.initInfo);

      // get guardians info
      // const res2:any = await api.guardian.getGuardianDetails({
      //   guardianHash: item.initInfo.initialGuardianHash,
      // });

      // setGuardiansInfo({
      //   guardianHash: recoverInfo.guardian_hash,
      //   guardianDetails: recoverInfo.guardian_info,
      // });

    } catch (e: any) {
      toast({
        title: 'Failed to login',
        description: e.response.data.data.message,
        status: 'error',
        duration: 5000,
      });
      throw new Error('Failed to login');
    }
  };

  const logoutWallet = async () => {
    clearLogData();
    navigate('/landing');
  };

  const initWallet = async (credentials: any, initialGuardianHash: string, walletName: string) => {
    const createIndex = 0;

    const initialKeys = credentials.map((item: any) => item.publicKey);

    const createSlotInfo = {
      initialKeys,
      initialGuardianHash,
      initialGuardianSafePeriod: toHex(defaultGuardianSafePeriod),
    };

    // do time consuming jobs
    const address = (
      await soulWallet.calcWalletAddress(createIndex, initialKeys, initialGuardianHash, defaultGuardianSafePeriod)
    ).OK;
    // const address2 = (
    //   await soulWallet.calcWalletAddress(
    //     createIndex,
    //     initialKeys,
    //     initialGuardianHash,
    //     Number(defaultGuardianSafePeriod),
    //     selectedChainId,
    //   )
    // ).OK;

    // setSelectedAddress(address);
    setAddressList([
      {
        address,
        chainIdHex: selectedChainId,
        activated: false,
      },
    ]);

    setWalletName(walletName);
    const res: any = await api.account.create({
      address,
      chainID: selectedChainId,
      name: walletName,
      initInfo: {
        index: createIndex,
        ...createSlotInfo,
      },
      // invitationCode,
    });
    if (res.code !== 200) {
      toast({
        title: 'Create wallet failed',
        description: res.msg,
        status: 'error',
      });
      throw new Error('Create wallet failed');
    }

    setSlotInfo(createSlotInfo);

    setCredentials(credentials as any);

    return {
      initialKeys,
    };
  };

  const getActivateOp = async () => {
    const createIndex = 0;
    const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(
      createIndex,
      slotInfo.initialKeys,
      slotInfo.initialGuardianHash,
      '0x',
      defaultGuardianSafePeriod,
    );

    if (userOpRet.isErr()) {
      throw new Error(userOpRet.ERR.message);
    }

    let userOp = userOpRet.OK;

    userOp.callData = '0x';

    userOp = await estimateGas(userOp, ZeroAddress);

    console.log(userOp, 'userOp');

    return userOp;
  };

  const getUserOp: any = async (txns: any, payToken: string) => {
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

      // todo, add noncekey and noncevalue
      const userOpRet = await soulWallet.fromTransaction(maxFeePerGas, maxPriorityFeePerGas, selectedAddress, txns);

      if (userOpRet.isErr()) {
        throw new Error(userOpRet.ERR.message);
      }

      let userOp = userOpRet.OK;

      userOp.preVerificationGas = `0x${BN(userOp.preVerificationGas.toString()).plus(15000).toString(16)}`;
      userOp.verificationGasLimit = `0x${BN(userOp.verificationGasLimit.toString()).plus(30000).toString(16)}`;

      userOp = await estimateGas(userOp, ZeroAddress);

      return userOp;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const estimateGas = async (userOp: any, payToken: string) => {
    // set 1559 fee
    // if (!userOp.maxFeePerGas || !userOp.maxPriorityFeePerGas) {
    const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();
    userOp.maxFeePerGas = maxFeePerGas;
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
    // }

    // if (payToken && payToken !== ethers.ZeroAddress) {
    //   userOp.paymasterAndData = addPaymasterAndData(payToken, chainConfig.contracts.paymaster);
    // }

    // get gas limit
    const gasLimit = await soulWallet.estimateUserOperationGas(
      chainConfig.contracts.defaultValidator,
      userOp,
      selectedKeyType,
    );

    if (gasLimit.isErr()) {
      throw new Error(gasLimit.ERR.message);
    }

    return userOp;
  };

  const getPasskeySignature = async (packedHash: string, validationData: string) => {
    const selectedCredential: any = getSelectedCredential();
    const signatureData: any = await signByPasskey(selectedCredential, packedHash);
    console.log('packUserOp256Signature params:', signatureData, validationData);
    const packedSignatureRet =
      selectedCredential.algorithm === 'ES256'
        ? await soulWallet.packUserOpP256Signature(
            chainConfig.contracts.defaultValidator,
            signatureData,
            validationData,
          )
        : selectedCredential.algorithm === 'RS256'
          ? await soulWallet.packUserOpRS256Signature(
              chainConfig.contracts.defaultValidator,
              signatureData,
              validationData,
            )
          : null;

    if (!packedSignatureRet) {
      throw new Error('algorithm not supported');
    }

    if (packedSignatureRet.isErr()) {
      throw new Error(packedSignatureRet.ERR.message);
    }

    return packedSignatureRet.OK;
  };

  const getSponsor = async (userOp: UserOperation) => {
    userOp.signature = (
      await soulWallet.getSemiValidSignature(import.meta.env.VITE_SoulWalletDefaultValidator, userOp, selectedKeyType)
    ).OK;

    let res: any;

    try {
      res = await api.sponsor.check(
        selectedChainId,
        chainConfig.contracts.entryPoint,
        JSON.parse(UserOpUtils.userOperationToJSON(userOp)),
      );

      if (res.code !== 200) {
        toast({
          title: 'Sponsor check failed',
          description: res.msg,
          status: 'error',
        });
        throw new Error('Sponsor check failed');
      }
    } catch (e: any) {
      toast({
        title: 'Sponsor check failed',
        description: e.response.data.data.message,
        status: 'error',
        duration: 5000,
      });
      throw new Error('Sponsor check failed');
    }

    if (res.data && res.data.paymasterData) {
      userOp = {
        ...userOp,
        ...res.data,
      };
    }

    return userOp;
  };

  const getGasPrice = async () => {
    // const res = await ethersProvider.getFeeData();
    // console.log('rrr', res);

    // return {
    //   maxFeePerGas: `0x${BN(res.maxFeePerGas).toString(16)}`,
    //   maxPriorityFeePerGas: `0x${BN(res.maxPriorityFeePerGas).toString(16)}`,
    // };

    try {
      const res = await axios.post(chainConfig.bundlerUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'pimlico_getUserOperationGasPrice',
        params: [],
      });

      if (res.data.result.fast) {
        return res.data.result.fast;
      } else {
        throw new Error('Failed to get gas price');
      }
    } catch {
      throw new Error('Failed to get gas price');
    }
  };

  const signAndSend = async (userOp: UserOperation) => {
    const validAfter = Math.floor(Date.now() / 1000 - 300);
    const validUntil = validAfter + 3600;

    const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

    if (packedUserOpHashRet.isErr()) {
      throw new Error(packedUserOpHashRet.ERR.message);
    }
    const packedUserOpHash = packedUserOpHashRet.OK;

    userOp.signature = await getPasskeySignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);

    try {
      return await executeTransaction(userOp, chainConfig);
    } catch (err) {
      toast({
        title: 'Transaction failed',
        status: 'error',
        description: String(err),
      });
      throw new Error(String(err));
    }
  };

  const signRawHash = async (hash: string) => {
    const packed1271HashRet = await soulWallet.getEIP1271TypedData(selectedAddress, hash);
    const packedHashRet = await soulWallet.packRawHash(packed1271HashRet.OK.typedMessage);

    let signature;

    signature = await getPasskeySignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    return signature;
  };

  const signWithPasskey = async (hash: string) => {
    const selectedCredential: any = getSelectedCredential();
    return await signByPasskey(selectedCredential, hash);
  };

  return {
    loginWallet,
    addPaymasterData,
    getActivateOp,
    signAndSend,
    signRawHash,
    signWithPasskey,
    logoutWallet,
    getSponsor,
    initWallet,
    getUserOp,
    boostAfterRecovered,
  };
}
