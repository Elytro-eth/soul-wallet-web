import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import { ethers } from 'ethers';
import SignTransactionModal from '@/components/SignTransactionModal';
import ConfirmPaymentModal from '@/components/ConfirmPaymentModal';
import SignMessageModal from '@/components/SignMessageModal';
import LogoutModal from '@/components/LogoutModal';
import FeedbackModal from '@/components/FeedbackModal';
import SendModal from '@/components/SendModal';
import ReceiveModal from '@/components/ReceiveModal';
import ActiveWalletModal from '@/components/ActiveWalletModal';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';

interface IWalletContext {
  ethersProvider: any;
  showSignTransaction: (txns: any, origin?: string, sendTo?: string, guardianInfo?: any) => Promise<void>;
  showConnectWallet: () => Promise<void>;
  showConfirmPayment: (fee: any, origin?: string, sendTo?: string) => Promise<void>;
  showClaimAssets: () => Promise<void>;
  showSignMessage: (messageToSign: any, signType?: string, guardianInfo?: any) => Promise<any>;
  showReceive: () => Promise<void>;
  showSend: (tokenAddress?: string, transferType?: string) => Promise<void>;
  showFeedback: () => Promise<void>;
  showLogout: (_redirectUrl?: string) => Promise<void>;
  showActiveWalletModal: () => Promise<void>;
  checkActivated: () => Promise<boolean | undefined>;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSignTransaction: async () => {},
  showConnectWallet: async () => {},
  showConfirmPayment: async () => {},
  showSignMessage: async () => {},
  showReceive: async () => {},
  showSend: async () => {},
  showClaimAssets: async () => {},
  showFeedback: async () => {},
  showLogout: async (_redirectUrl?: any) => {},
  showActiveWalletModal: async () => {},
  checkActivated: async () => undefined,
});

export const WalletContextProvider = ({ children }: any) => {
  console.log('Render WalletContext');
  const { selectedChainItem } = useConfig();
  const { selectedAddress, getIsActivated, setActivated } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const signTransactionModal = useRef<any>();
  const connectWalletModal = useRef<any>();
  const confirmPaymentModal = useRef<any>();
  const signMessageModal = useRef<any>();
  const receiveModal = useRef<any>();
  const sendModal = useRef<any>();
  const claimAssetsModal = useRef<any>();
  const logoutModal = useRef<any>();
  const feedbackModal = useRef<any>();
  const activeWalletModal = useRef<any>();

  const ethersProvider = useMemo(() => {
    console.log('trigger ethers provider');
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);

  const showSignTransaction = async (txns: any, origin?: string, sendTo?: string, guardianInfo?: any) => {
    return await signTransactionModal.current.show(txns, origin, sendTo, guardianInfo);
  };

  const showConnectWallet = async () => {
    return await connectWalletModal.current.show();
  };

  const showConfirmPayment = async (fee: any, origin?: string, sendTo?: string) => {
    return await confirmPaymentModal.current.show(fee, origin, sendTo);
  };

  const showSignMessage = async (messageToSign: string, signType?: string, guardianInfo?: any) => {
    return await signMessageModal.current.show(messageToSign, signType, guardianInfo);
  };

  const showReceive = async () => {
    return await receiveModal.current.show();
  };

  const showSend = async (tokenAddress?: string, transferType?: string) => {
    return await sendModal.current.show(tokenAddress, transferType);
  };

  const showClaimAssets = async () => {
    return await claimAssetsModal.current.show();
  };

  const showFeedback = async () => {
    return await feedbackModal.current.show();
  };

  const showLogout = async (_redirectUrl: any) => {
    return await logoutModal.current.show(_redirectUrl);
  };

  const showActiveWalletModal = async () => {
    return await activeWalletModal.current.show();
  };

  const checkActivated = async () => {
    const res = getIsActivated(selectedAddress, selectedChainId);
    if (res) {
      return true;
    } else {
      const contractCode = await ethersProvider.getCode(selectedAddress);
      console.log('check code result', contractCode);
      // is already activated
      if (contractCode !== '0x') {
        setActivated(selectedAddress, true);
        return true;
      } else {
        return false;
      }
    }
  };

  useEffect(() => {
    if (!selectedAddress || !selectedChainId) {
      return;
    }
    checkActivated();
  }, [selectedAddress, selectedChainId]);

  return (
    <WalletContext.Provider
      value={{
        ethersProvider,
        showSignTransaction,
        showConnectWallet,
        showSignMessage,
        showConfirmPayment,
        showReceive,
        showSend,
        showClaimAssets,
        showLogout,
        showFeedback,
        showActiveWalletModal,
        checkActivated,
      }}
    >
      {children}
      <SignTransactionModal ref={signTransactionModal} />
      <ConfirmPaymentModal ref={confirmPaymentModal} />
      <SignMessageModal ref={signMessageModal} />
      <ReceiveModal ref={receiveModal} />
      <SendModal ref={sendModal} />
      <FeedbackModal ref={feedbackModal} />
      <ActiveWalletModal ref={activeWalletModal} />
      <LogoutModal ref={logoutModal} />
      {/* <ConnectWalletModal ref={connectWalletModal} /> */}
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
