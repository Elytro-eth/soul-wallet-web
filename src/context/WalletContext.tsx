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
import { useTempStore } from '@/store/temp';

interface IWalletContext {
  ethersProvider: any;
  showSignTransaction: (txns: any, origin?: string, sendTo?: string) => Promise<void>;
  showConnectWallet: () => Promise<void>;
  showConfirmPayment: (fee: any, origin?: string, sendTo?: string) => Promise<void>;
  showClaimAssets: () => Promise<void>;
  showSignMessage: (messageToSign: any, signType?: string, guardianInfo?: any) => Promise<any>;
  showReceive: () => Promise<void>;
  showSend: (tokenAddress?: string, transferType?: string) => Promise<void>;
  showFeedback: () => Promise<void>;
  showLogout: (_redirectUrl?: string) => Promise<void>;
  showActiveWalletModal: () => Promise<void>;
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
});

export const WalletContextProvider = ({ children }: any) => {
  console.log('Render WalletContext');
  const { selectedChainItem } = useConfig();
  const { recoverInfo } = useTempStore();
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

  useEffect(() => {
    const { recoverInfo } = useTempStore.getState();

    console.log('set interval recover info', recoverInfo);

    // const recoveryRecordID = recoverInfo.recoveryRecordID;

    // if (!recoveryRecordID) {
    //   return;
    // }

    // checkRecoverStatus(recoverInfo);

    // const interval = setInterval(() => checkRecoverStatus(recoverInfo), 5000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, [recoverInfo.recoveryRecordID]);

  const showSignTransaction = async (txns: any, origin?: string, sendTo?: string) => {
    return await signTransactionModal.current.show(txns, origin, sendTo);
  };

  const showConnectWallet = async () => {
    return await connectWalletModal.current.show();
  };

  const showConfirmPayment = async (fee: any, origin?: string, sendTo?: string) => {
    return await confirmPaymentModal.current.show(fee, origin, sendTo);
  };

  const showSignMessage = async (messageToSign: string, signType?: string, guardianInfo?: any) => {
    console.log('G', guardianInfo)

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
        showActiveWalletModal
      }}
    >
      {children}
      {/** todo, move to another component **/}
      <SignTransactionModal ref={signTransactionModal} />
      <ConfirmPaymentModal ref={confirmPaymentModal} />
      <SignMessageModal ref={signMessageModal} />
      {/* <ClaimAssetsModal ref={claimAssetsModal} /> */}
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
