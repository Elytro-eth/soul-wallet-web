import { nanoid } from 'nanoid';
import { ethers, Contract } from 'ethers';
import BN from 'bignumber.js';
import { chainIdMapping, chainMapping } from '@/config';
import IconDefault from '@/assets/tokens/default.svg';
import storage from '@/lib/storage';
import { erc20Abi } from 'viem';
import { DecodeUserOp, DecodeResult } from '@soulwallet/decoder';
import { UserOperation } from '@soulwallet/sdk';
import IconSend from '@/assets/activities/send.svg';
import IconMint from '@/assets/activities/mint.svg';
import IconApprove from '@/assets/activities/approve.svg';
import IconTrade from '@/assets/activities/trade.svg';
// import IconReceive from '@/assets/activities/receive.svg';
import IconContract from '@/assets/activities/contract.svg';

import MetamaskIcon from '@/assets/wallets/metamask.png';
import WalletConnectIcon from '@/assets/wallets/wallet-connect.png';
import InjectedIcon from '@/assets/wallets/injected.svg';
import UnknownIcon from '@/assets/wallets/unknown.svg';

export const getWalletIcon = (walletId: string) => {
  switch (walletId) {
    case 'injected':
      return InjectedIcon;
    case 'walletConnect':
      return WalletConnectIcon;
    case 'io.metamask':
      return MetamaskIcon;
    default:
      return UnknownIcon;
  }
};

export function parseBase64url(base64url: string) {
  base64url = base64url.replace(/\-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64url), (c) => c.charCodeAt(0)).buffer;
}

export function arrayBufferToHex(arrayBuffer: any) {
  const uint8Array = new Uint8Array(arrayBuffer);
  return (
    '0x' +
    Array.from(uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function hexToUint8Array(hex: string) {
  if (hex.startsWith('0x')) hex = hex.slice(2);
  const len = hex.length;
  const uint8Array = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    uint8Array[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return uint8Array;
}

export function stringToUint8Array(str: string) {
  return new TextEncoder().encode(str);
}

export function clearStorageWithCredentials() {
  storage.clear();
  // const credentialKey = 'local-credentials'
  // const credentialStorage = storage.getItem(credentialKey);
  // console.log('ready to do clear', storage.getItem('credential-storage'))
  // storage.clear();
  // if(credentialStorage){
  //     storage.setItem(credentialKey, credentialStorage)
  // }
}

export function copyText(value: string) {
  const copied = document.createElement('input');
  copied.setAttribute('value', value);
  document.body.appendChild(copied);
  copied.select();
  document.execCommand('copy');
  document.body.removeChild(copied);
}

export const validateEmail = (email?: string) => {
  if (!email) return false;
  const emialRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emialRegex.test(String(email).toLowerCase());
};

export const getMessageType = (msg: string) => {
  if (msg.startsWith('0x') && msg.length === 66) {
    return 'hash';
  } else {
    return 'text';
  }
};

export const nextRandomId = () => {
  return nanoid();
};

export const formatIPFS = (url: string) => {
  if (url && url.includes('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  } else {
    return url;
  }
};

export const addPaymasterData = (payToken: string, paymaster: string) => {
  if (payToken === ethers.ZeroAddress) {
    return '0x';
  }

  // TODO, consider decimals
  const paymasterData = `${paymaster}${new ethers.AbiCoder()
    .encode(['address', 'uint256'], [payToken, ethers.parseEther('1000')])
    .slice(2)}`;

  return paymasterData;
};

export const checkShouldInject = (origin: string) => {
  const settingStorage = storage.getJson('setting-storage');
  const globalShouldInject = settingStorage.state.globalShouldInject;
  const shouldInjectList = settingStorage.state.shouldInjectList;
  const shouldNotInjectList = settingStorage.state.shouldNotInjectList;

  let flag = false;
  if (!origin.startsWith('http')) {
    flag = false;
  } else if (shouldInjectList.includes(origin)) {
    flag = true;
  } else if (shouldNotInjectList.includes(origin)) {
    flag = false;
  } else if (globalShouldInject) {
    flag = true;
  } else if (!globalShouldInject) {
    flag = false;
  }

  return flag;
};

export const getSelectedChainItem = () => {
  const chainStorage = storage.getJson('chain-storage');
  const selectedChainId = chainStorage.state.selectedChainId;
  const selectedChainItem = chainStorage.state.chainList.filter((item: any) => item.chainIdHex === selectedChainId)[0];
  return selectedChainItem;
};

const to10 = (n: any) => {
  return BN(n).toString();
};

export const getCurrentTimeFormatted = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}-${hour}:${minute}:${second}`;
};

export const isNativeMethod = (fn: any) => {
  return /\{\s*\[native code\]\s*\}/.test('' + fn);
};

export const base64ToBigInt = (base64String: string) => {
  const binaryString = atob(base64String);
  let result = BigInt(0);
  for (let i = 0; i < binaryString.length; i++) {
    result = (result << BigInt(8)) | BigInt(binaryString.charCodeAt(i));
  }
  return result;
};

export const base64ToBuffer = (base64String: string) => {
  let binaryString = atob(base64String);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const uint8ArrayToHexString = (byteArray: Uint8Array) => {
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

// export const uint8ArrayToString = (byteArray: Uint8Array) => {
//   return Array.from(byteArray).map(byte => byte.toString(2).padStart(2, '0')).join('');
// }

export const printUserOp = (userOp: any) => {
  console.log(
    JSON.stringify([
      {
        sender: userOp.sender,
        nonce: userOp.nonce.toString(),
        initCode: userOp.initCode,
        callData: userOp.callData,
        callGasLimit: to10(userOp.callGasLimit),
        verificationGasLimit: to10(userOp.verificationGasLimit),
        preVerificationGas: to10(userOp.preVerificationGas),
        maxFeePerGas: to10(userOp.maxFeePerGas),
        maxPriorityFeePerGas: to10(userOp.maxPriorityFeePerGas),
        paymasterData: userOp.paymasterData,
        signature: userOp.signature,
      },
    ]),
  );
};

export const findMissingNumbers = (range: number[], existArray: number[]) => {
  return range.filter((item) => !existArray.includes(item));
};

export const truncateString = (str: string, num: number) => {
  if (str.length > num) {
    return str.substring(0, num) + '...';
  }
  return str;
};

export const hasCommonElement = (arr1: [], arr2: []) => {
  return arr1.some((item) => arr2.includes(item));
};

export const toShortAddress = (address: string, firstSlice: number = 5, lastSlice: number = 5) => {
  if (address && address.length > 10) {
    return `${address.slice(0, firstSlice)}...${address.slice(-lastSlice)}`;
  }

  return address;
};

export const trimPrefix = (address: any) => {
  if (address && address.indexOf(':') !== -1) {
    return address.split(':')[1];
  }

  return address;
};

// format currency especially for big number
export function formatCurrency(num: number) {
  if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(2).replace(/\.00$/, '') + 'K';
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2).replace(/\.00$/, '') + 'B';
  } else {
    return num.toString();
  }
}

export function toFixed(num: number | string | undefined, maxDecimalPlaces: number) {
  if (!num) {
    return '0';
  }
  let fixedStr = Number(num).toFixed(maxDecimalPlaces);
  let trimmedStr = fixedStr.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
  return new BN(trimmedStr).toFormat();
}

export const getNetwork = (chainId: number) => {
  const name = chainIdMapping[chainId as keyof typeof chainIdMapping] || '';
  console.log('getNetwork', chainId, name);
  return name;
};

export const getChainInfo = (chainId: string) => {
  return (
    chainMapping[chainId as keyof typeof chainMapping] || { icon: IconDefault, name: `Chain ID: ${Number(chainId)}` }
  );
};

export const getStatus = (statusId: number) => {
  if (statusId === 1) {
    return 'Recovered';
  } else if (statusId === 0) {
    return 'Pending';
  }

  return 'Pending';
};

export const getKeystoreStatus = (statusId: number) => {
  if (statusId === 3) {
    return 'Recovered';
  }

  return 'Pending';
};

export const toHex = (num: any) => {
  let hexStr = num.toString(16);

  if (hexStr.length % 2 === 1) {
    hexStr = '0' + hexStr;
  }

  hexStr = '0x' + hexStr;

  return hexStr;
};

export const toCapitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const decodeCalldata = async (
  chainId: string,
  entrypoint: string,
  userOp: UserOperation,
  ethersProvider: any,
) => {
  const decodeRet = await DecodeUserOp(parseInt(chainId), entrypoint, userOp);
  // console.log('decoded tx:', decodeRet.OK)
  if (decodeRet.isErr()) {
    console.error(decodeRet.ERR);
    return [];
  }

  const decoded: any[] = decodeRet.OK;

  if (userOp.factory !== null && userOp.factory.length === 42 && userOp.factory !== ethers.ZeroAddress) {
    decoded.unshift({
      functionName: 'Create Wallet',
    });
  }

  for (let i of decoded) {
    if (!i.method && i.value) {
      i.functionName = 'Transfer ETH';
    }

    if (i.method && i.method.name === 'transfer') {
      // get erc20 info
      const tokenAddress = i.to;
      const tokenContract = new Contract(tokenAddress, erc20Abi, ethersProvider);

      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      const amount = BN(i.method.params['1']).shiftedBy(-BN(decimals)).toFixed();

      i.sendErc20Amount = `${amount} ${symbol}`;
      i.sendErc20Address = i.method.params['0'];
    }
  }

  return decoded;
};

export const getIconMapping = (name: string) => {
  switch (name.toLowerCase()) {
    case 'transfer erc20':
      return IconSend;
    case 'transfer eth':
      return IconSend;
    case 'mint':
    case 'minttoken':
      return IconMint;
    case 'approve':
      return IconApprove;
    case 'swap':
    case 'deposit':
      return IconTrade;
    default:
      return IconContract;
  }
};
