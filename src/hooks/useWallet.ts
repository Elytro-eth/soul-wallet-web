import { MaxUint256, ZeroAddress, ZeroHash, ethers, parseEther } from 'ethers';
import useSdk from './useSdk';
import useQuery from './useQuery';
import { ABI_SocialRecoveryModule, ABI_SoulWallet } from '@soulwallet/abi';
import { useSlotStore } from '@/store/slot';
import { addPaymasterData } from '@/lib/tools';
import { erc20Abi, verifyMessage } from 'viem';
import { SignkeyType, SocialRecovery, Transaction, UserOperation } from '@soulwallet/sdk';
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
import { fetchTokenBalanceApi } from '@/store/balance';
// import { aaveUsdcPoolAbi, claimInterestAbi } from '@/contracts/abis';
// import useTransaction from './useTransaction';
import useTools from './useTools';
import BN from 'bignumber.js';
import useBrowser from './useBrowser';
import { useBalanceStore } from '@/store/balance';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useTempStore } from '@/store/temp';
// import { useGuardianStore } from '@/store/guardian';

export const noGuardian = {
  initialGuardianHash: ethers.ZeroHash,
  initialGuardianSafePeriod: defaultGuardianSafePeriod,
};

export default function useWallet() {
  const { signByPasskey, authenticate, authenticateLogin } = usePasskey();
  const { chainConfig } = useConfig();
  const { setSlotInfo } = useSlotStore();
  const { selectedChainId, setSelectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential, selectedKeyType } = useSignerStore();
  const { soulWallet } = useSdk();
  const { navigate } = useBrowser();
  const { clearTempInfo, recoverInfo } = useTempStore();
  const toast = useToast();
  const { getTokenBalance, setTokenBalance } = useBalanceStore();
  const { clearLogData } = useTools();
  const { selectedAddress, setSelectedAddress, setWalletName, setAddressList } = useAddressStore();

  const loginWallet = async (credentialId?: string) => {
    const { credential, challenge, authentication } = await authenticateLogin(credentialId);
    console.log({ credential })
    try {
      const res: any = await api.account.get({
        ownerKey: credential.onchainPublicKey,
      });

      if (res.code !== 200) {
        toast({
          title: 'Failed to login',
          description: res.msg,
          status: 'error',
          duration: 5000,
        });
        throw new Error('Failed to login');
      }

      // consider first item only for now
      const accountInfo = res.data;

      // set jwt
      const resJwt = await api.auth.getJwt({
        address: accountInfo.address,
        chainID: accountInfo.chainID,
        challenge,
        responseData: {
          isRegistration: false,
          credentialID: credential.credentialID,
          data: authentication,
        },
      });
      localStorage.setItem('token', resJwt.data.token);

      const balances = await fetchTokenBalanceApi(accountInfo.address, accountInfo.chainID);

      setTokenBalance(balances);

      setCredentials([credential as any]);
      setWalletName(accountInfo.name);
      setSelectedAddress(accountInfo.address);
      setAddressList([
        {
          address: accountInfo.address,
          chainIdHex: accountInfo.chainID,
        },
      ]);
      setSelectedChainId(accountInfo.chainID);
      setSlotInfo(accountInfo.initInfo);
      // rob, IMPORTANT TODO, fetch GUARDIANS
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

  const getTransferEthOp = async (amount: string, to: string, skipSponsor: boolean) => {
    const ethBalance = getTokenBalance(ZeroAddress)?.tokenBalanceFormatted;

    let txs = [];

    if (BN(amount).isGreaterThan(BN(ethBalance))) {
      toast({
        title: 'Insufficient balance',
        status: 'error',
      });
      return;
    }

    txs.push({
      from: selectedAddress,
      to,
      data: '0x',
      value: parseEther(amount).toString(),
    });

    return await getUserOp(txs, skipSponsor);
  };

  const getTransferErc20Op = async (
    amount: string,
    decimals: number,
    to: string,
    skipSponsor: boolean,
    tokenAddress: string,
  ) => {
    const erc20 = new ethers.Interface(erc20Abi);

    const erc20Balance = getTokenBalance(tokenAddress)?.tokenBalanceFormatted;

    let txs = [];

    if (BN(amount).isGreaterThan(BN(erc20Balance))) {
      toast({
        title: 'Insufficient balance',
        status: 'error',
      });
      return;
    }

    txs.push({
      from: selectedAddress,
      to: tokenAddress,
      data: erc20.encodeFunctionData('transfer', [to, ethers.parseUnits(String(amount), decimals)]),
    });

    return await getUserOp(txs, skipSponsor);
  };

  const getChangeGuardianOp = async (newGuardianHash: string) => {
    const soulAbi = new ethers.Interface(ABI_SocialRecoveryModule);
    const callData = soulAbi.encodeFunctionData('setGuardian(bytes32)', [newGuardianHash]);
    const tx: Transaction = {
      to: chainConfig.contracts.socialRecoveryModule,
      data: callData,
    };

    return await getUserOp([tx]);
  };

  const getActivateOp = async (_initialKeys: any) => {
    const createIndex = 0;
    const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(
      createIndex,
      _initialKeys,
      noGuardian.initialGuardianHash,
      '0x',
      noGuardian.initialGuardianSafePeriod,
    );

    if (userOpRet.isErr()) {
      throw new Error(userOpRet.ERR.message);
    }

    let userOp = userOpRet.OK;

    // approve paymaster to spend ERC-20
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    const erc20Interface = new ethers.Interface(erc20Abi);
    // approve defi contract to spend token
    const approveTos = [
      // erc20 address
      '',
    ];
    const approveCalldata = erc20Interface.encodeFunctionData('approve', [
      // approve to who
      '',
      MaxUint256,
    ]);

    const approveCalldatas = [...new Array(approveTos.length)].map(() => approveCalldata);

    const finalValues = [...new Array(approveTos.length).fill('0x0')];

    const executions: string[][] = approveTos.map((to, index) => [to, finalValues[index], approveCalldatas[index]]);

    userOp.callData = soulAbi.encodeFunctionData('executeBatch((address,uint256,bytes)[])', [executions]);

    const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

    const gas = await getGasPrice();

    console.log('GAS', gas);

    userOp.maxFeePerGas = maxFeePerGas;
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    userOp = await getSponsor(userOp);

    return userOp;
  };

  const getUserOp: any = async (txns: any, skipSponsor?: boolean) => {
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

      const userOpRet = await soulWallet.fromTransaction(maxFeePerGas, maxPriorityFeePerGas, selectedAddress, txns);

      if (userOpRet.isErr()) {
        throw new Error(userOpRet.ERR.message);
      }

      let userOp = userOpRet.OK;

      if (!skipSponsor) {
        userOp = await getSponsor(userOp);
      }

      return userOp;
    } catch (err: any) {
      throw new Error(err.message);
    }
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
    try {
      const res = await axios.post(chainConfig.bundlerUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'pimlico_getUserOperationGasPrice',
        params: [],
      });

      console.log('pricessss', res);

      if (res.data.result.fast) {
        return res.data.result.fast;
      } else {
        throw new Error('Failed to get gas price');
      }
    } catch {
      throw new Error('Failed to get gas price');
    }
  };

  const boostAfterRecovered = async (_recoverInfo: any) => {
    setAddressList([
      {
        address: _recoverInfo.address,
        chainIdHex: _recoverInfo.chainID,
      },
    ]);
    setCredentials([recoverInfo.credential]);
    setSelectedChainId(_recoverInfo.chainID);
    setSlotInfo({
      ..._recoverInfo.initInfo,
    });
    clearTempInfo();
  };

  const signAndSend = async (userOp: UserOperation) => {
    try {
      const validAfter = Math.floor(Date.now() / 1000 - 300);
      const validUntil = validAfter + 3600;

      const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

      if (packedUserOpHashRet.isErr()) {
        throw new Error(packedUserOpHashRet.ERR.message);
      }
      const packedUserOpHash = packedUserOpHashRet.OK;

      userOp.signature = await getPasskeySignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);

      console.log('before execute');
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

  const sendTxs = async (txs: any[]) => {
    try {
      const uos = await getUserOp(txs);
      return await signAndSend(uos)
    } catch (err) {
      throw err;
    }
  }

  return {
    loginWallet,
    getTransferEthOp,
    getTransferErc20Op,
    addPaymasterData,
    getActivateOp,
    signAndSend,
    signRawHash,
    signWithPasskey,
    logoutWallet,
    getSponsor,
    getChangeGuardianOp,
    boostAfterRecovered,
    sendTxs
  };
}
