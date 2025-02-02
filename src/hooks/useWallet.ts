import { ethers } from 'ethers';
import useSdk from './useSdk';
import useQuery from './useQuery';
import { ABI_SoulWallet } from '@soulwallet/abi';
import { useGuardianStore } from '@/store/guardian';
import { useSlotStore } from '@/store/slot';
import { addPaymasterData } from '@/lib/tools';
import { erc20Abi, verifyMessage } from 'viem';
import { L1KeyStore, SignkeyType, UserOperation } from '@soulwallet/sdk';
import { executeTransaction } from '@/lib/tx';
import BN from 'bignumber.js';
import useConfig from './useConfig';
import api from '@/lib/api';
import usePasskey from './usePasskey';
import { toHex } from '@/lib/tools';
import { useSignMessage } from 'wagmi';
import { useSignerStore } from '@/store/signer';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useTempStore } from '@/store/temp';
import { useSettingStore } from '@/store/setting';
import { getWalletAddress } from '@/pages/recover/RecoverProgress';

export default function useWallet() {
  const { signByPasskey } = usePasskey();
  const { set1559Fee } = useQuery();
  const { chainConfig } = useConfig();
  const { ethersProvider } = useWalletContext();
  const { signMessageAsync } = useSignMessage();
  const { updateGuardiansInfo } = useGuardianStore();
  const { slotInfo, setSlotInfo, getSlotInfo } = useSlotStore();
  const { updateChainItem, setSelectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential } = useSignerStore();
  const { soulWallet, calcWalletAddressAllChains } = useSdk();
  const { selectedAddress, setAddressList, updateAddressItem } = useAddressStore();
  const { getSelectedKeyType, setEoas } = useSignerStore();
  const { setSignerIdAddress, setFinishedSteps, saveAddressName, getRecoverRecordId } = useSettingStore();
  const { clearCreateInfo, recoverInfo, setRecoverInfo, updateRecoverInfo, clearTempStore } = useTempStore();

  const createWallet = async ({
    initialGuardianHash,
    initialGuardianSafePeriod,
  }: {
    initialGuardianHash: string;
    initialGuardianSafePeriod: number;
  }) => {
    // retrieve info from temp store
    const { credentials = [], eoaAddress = [] } = useTempStore.getState().createInfo;
    const keystore = chainConfig.contracts.l1Keystore;

    const credentialKeys = credentials.map((item: any) => item.publicKey);
    const credentialIds = credentials.map((item: any) => item.id);

    const initialKeys = [...credentialKeys, ...eoaAddress].filter((item) => item);

    const initialSignerIds = [...credentialIds, ...eoaAddress].filter((item) => item);

    const initialKeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initialKeysAddress);

    const slot = L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);

    // save slot info to api
    await api.guardian.backupSlot({
      keystore,
      slot,
      slotInitInfo: {
        initialKeyHash,
        initialGuardianHash,
        initialGuardianSafePeriod: toHex(initialGuardianSafePeriod),
      },
      initialKeys: initialKeysAddress,
    });

    setSlotInfo({
      initialKeys,
      initialKeyHash,
      initialKeysAddress,
      slot,
      initialGuardianHash,
      initialGuardianSafePeriod: toHex(initialGuardianSafePeriod),
    });

    const { walletName } = useTempStore.getState().createInfo;
    console.log('walletName', slot, walletName);
    if (walletName && slot) saveAddressName(slot, walletName);

    console.log('after public backup slot');

    const addresses = await calcWalletAddressAllChains(0);

    setAddressList(addresses);

    // save signer id to address mapping
    const chainIdAddress = addresses.reduce((obj, item) => {
      return {
        ...obj,
        [item.chainIdHex]: item.address,
      };
    }, {});

    initialSignerIds.forEach((item) => {
      setSignerIdAddress(item, chainIdAddress);
    });

    if (credentials.length > 0) {
      setCredentials(credentials);
    }
    if (eoaAddress && eoaAddress.length > 0) {
      setEoas(eoaAddress);
    }

    // clearTempStore();

    clearCreateInfo();
  };

  const getActivateOp = async (index: number, payToken: string, extraTxs: any = []) => {
    console.log('extraTxs', extraTxs);
    const { initialKeys, initialGuardianHash, initialGuardianSafePeriod } = slotInfo;
    const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(
      index,
      initialKeys,
      initialGuardianHash,
      '0x',
      initialGuardianSafePeriod,
    );

    if (userOpRet.isErr()) {
      throw new Error(userOpRet.ERR.message);
    }

    let userOp = userOpRet.OK;

    // approve paymaster to spend ERC-20
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    const erc20Interface = new ethers.Interface(erc20Abi);
    const approveTos = chainConfig.paymasterTokens;
    const approveCalldata = erc20Interface.encodeFunctionData('approve', [
      chainConfig.contracts.paymaster,
      ethers.parseEther('1000'),
    ]);

    const approveCalldatas = [...new Array(approveTos.length)].map(() => approveCalldata);

    const finalTos = [...approveTos, ...extraTxs.map((tx: any) => tx.to)];

    const finalCalldatas = [...approveCalldatas, ...extraTxs.map((tx: any) => tx.data)];

    const finalValues = [...new Array(approveTos.length).fill('0x0'), ...extraTxs.map((tx: any) => tx.value || '0x0')];

    const executions: string[][] = finalTos.map((to, index) => [to, finalValues[index], finalCalldatas[index]]);

    userOp.callData = soulAbi.encodeFunctionData('executeBatch((address,uint256,bytes)[])', [executions]);

    userOp = await set1559Fee(userOp, payToken);

    let callGasLimit = BN(approveTos.length * 50000);

    for (let i = 0; i < extraTxs.length; i++) {
      // get gas from tx or onchain
      const gas = BN(extraTxs[i].gas).isGreaterThan(0)
        ? BN(extraTxs[i].gas)
        : await ethersProvider.estimateGas(extraTxs[i]);
      callGasLimit = callGasLimit.plus(gas);
    }

    console.log('estimate callGaslimit', callGasLimit);

    userOp.callGasLimit = `0x${
      BN(callGasLimit).isGreaterThan(finalTos.length * 50000)
        ? callGasLimit.toString(16)
        : Number(finalTos.length * 50000).toString(16)
    }`;
    userOp.preVerificationGas = `0x${BN(userOp.preVerificationGas.toString()).plus(15000).toString(16)}`;
    userOp.verificationGasLimit = `0x${BN(userOp.verificationGasLimit.toString()).plus(10_000).toString(16)}`;

    return userOp;
  };

  const getSetGuardianCalldata = async (slot: string, guardianHash: string, keySignature: string) => {
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    return soulAbi.encodeFunctionData('setGuardian(bytes32,bytes32,bytes32)', [slot, guardianHash, keySignature]);
  };

  const getEoaSignature = async (packedHash: any, validationData: string) => {
    const signatureData: any = await signWithEoa(packedHash);

    console.log('packUserEoaSignature params:', signatureData, validationData);

    const packedSignatureRet = await soulWallet.packUserOpEOASignature(
      chainConfig.contracts.defaultValidator,
      signatureData,
      validationData,
    );

    if (!packedSignatureRet) {
      throw new Error('failed to sign');
    }

    if (packedSignatureRet.isErr()) {
      throw new Error(packedSignatureRet.ERR.message);
    }

    return packedSignatureRet.OK;
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

  const signAndSend = async (userOp: UserOperation, payToken?: string) => {
    const selectedKeyType = getSelectedKeyType();
    // checkpaymaster
    if (payToken && payToken !== ethers.ZeroAddress && userOp.paymasterData === '0x') {
      userOp.paymasterData = addPaymasterData(payToken, chainConfig.contracts.paymaster);
    }

    const validAfter = Math.floor(Date.now() / 1000 - 300);
    const validUntil = validAfter + 3600;
    // const validAfter = '0';
    // const validUntil = '0';

    const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

    if (packedUserOpHashRet.isErr()) {
      throw new Error(packedUserOpHashRet.ERR.message);
    }
    const packedUserOpHash = packedUserOpHashRet.OK;

    console.log('selected key type', selectedKeyType);

    if (selectedKeyType === SignkeyType.EOA) {
      userOp.signature = await getEoaSignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);
    } else if (selectedKeyType === SignkeyType.P256 || selectedKeyType === SignkeyType.RS256) {
      userOp.signature = await getPasskeySignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);
    } else {
      console.error('No sign key type selected');
    }

    return await executeTransaction(userOp, chainConfig);
  };

  const signRawHash = async (hash: string) => {
    const selectedKeyType = getSelectedKeyType();

    const packed1271HashRet = await soulWallet.getEIP1271TypedData(selectedAddress, hash);
    const packedHashRet = await soulWallet.packRawHash(packed1271HashRet.OK.typedMessage);

    let signature;

    if (selectedKeyType === SignkeyType.EOA) {
      signature = await getEoaSignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    } else if (selectedKeyType === SignkeyType.P256 || selectedKeyType === SignkeyType.RS256) {
      signature = await getPasskeySignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    }
    return signature;
  };

  const signWithPasskey = async (hash: string) => {
    const selectedCredential: any = getSelectedCredential();
    return await signByPasskey(selectedCredential, hash);
  };

  const signWithEoa = async (hash: any) => {
    return await signMessageAsync({
      message: {
        raw: hash,
      },
    });
  };

  const retrieveSlotInfo = (initInfo: any) => {
    // set slot info
    const initialKeysAddress = L1KeyStore.initialKeysToAddress(initInfo.initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initialKeysAddress);

    setSlotInfo({
      initialKeys: initInfo.initialKeys,
      initialKeyHash,
      initialKeysAddress,
      slot: initInfo.slot,
      initialGuardianHash: initInfo.slotInitInfo.initialGuardianHash,
      initialGuardianSafePeriod: initInfo.slotInitInfo.initialGuardianSafePeriod,
    });
  };

  // will be executed only once after recover process finished
  const boostAfterRecovered = async (_recoverInfo: any) => {
    retrieveSlotInfo({
      ..._recoverInfo,
      initialKeys: _recoverInfo.initialKeysAddress,
    });
    const addressList = _recoverInfo.recoveryRecord.addresses.map((item: any) => ({
      address: item.address,
      chainIdHex: item.chain_id,
    }));
    console.log('yoooo', addressList);
    setAddressList(addressList);
    const credentialsInStore = _recoverInfo.signers.filter((signer: any) => signer.type === 'passkey');
    const eoasInStore = _recoverInfo.signers.filter((signer: any) => signer.type === 'eoa');
    if (credentialsInStore.length) setCredentials(credentialsInStore);
    if (eoasInStore.length) setEoas(eoasInStore.map((signer: any) => signer.signerId));
    // set mainnet if no selected chainId
    setSelectedChainId(import.meta.env.VITE_MAINNET_CHAIN_ID);

    updateGuardiansInfo({
      guardianDetails: _recoverInfo.guardianDetails,
      guardianHash: _recoverInfo.guardianHash,
      guardianNames: _recoverInfo.guardianNames,
      keystore: _recoverInfo.keystore,
      slot: _recoverInfo.slot,
    });

    const res = await api.operation.finishStep({
      slot: _recoverInfo.slot,
      steps: [5],
    });

    setFinishedSteps(res.data.finishedSteps);

    // set new signerIds and remove old ones
    const credentialIds = credentialsInStore.map((item: any) => item.id);
    const eoaIds = eoasInStore.map((item: any) => item.address);

    const chainIdAddress = addressList.reduce((obj: any, item: any) => {
      return {
        ...obj,
        [item.chainIdHex]: item.address,
      };
    }, {});

    const newSignerIds = [...credentialIds, ...eoaIds].filter((item) => item);
    // set new signerIdAddress
    newSignerIds.forEach((item) => {
      setSignerIdAddress(item, chainIdAddress);
    });

    updateRecoverInfo({
      enabled: true,
    });
  };

  const checkRecoverStatus = async (_recoverInfo: any) => {
    const { recoveryRecordID } = _recoverInfo;
    if (!recoveryRecordID) {
      return;
    }

    const res = (await api.guardian.getRecoverRecord({ recoveryRecordID })).data;
    updateRecoverInfo({
      recoveryRecord: res,
    });

    // check if should replace key
    if (res.status >= 3) {
      if (!_recoverInfo.enabled) {
        await boostAfterRecovered(_recoverInfo);
      }
    }

    // recover process finished
    if (res.status === 4) {
      setRecoverInfo({});
    }

    const chainRecoverStatus = res.statusData.chainRecoveryStatus;
    for (let item of chainRecoverStatus) {
      const addressToSet = getWalletAddress(item.chainId, res.addresses);
      updateAddressItem(addressToSet, {
        recovering: item.status === 0,
      });
    }
  };

  return {
    createWallet,
    addPaymasterData,
    getActivateOp,
    getSetGuardianCalldata,
    signAndSend,
    signRawHash,
    signWithPasskey,
    signWithEoa,
    retrieveSlotInfo,
    boostAfterRecovered,
    checkRecoverStatus,
  };
}
