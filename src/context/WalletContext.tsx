import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { ethers } from 'ethers';
import SignMessageModal from '@/components/SignMessageModal';
import SendModal from '@/components/SendModal';
import ReceiveModal from '@/components/ReceiveModal';
import useConfig from '@/hooks/useConfig';

interface IWalletContext {
  ethersProvider: any;
  showSignMessage: (messageToSign: any, signType?: string, guardianInfo?: any) => Promise<any>;
  showReceive: () => Promise<void>;
  showSend: (tokenAddress?: string, transferType?: string) => Promise<void>;
  isModalOpen: any;
  activeModal: any;
  openModal: any;
  closeModal: any;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSignMessage: async () => {},
  showReceive: async () => {},
  showSend: async () => {},
  isModalOpen: false,
  activeModal: null,
  openModal: () => {},
  closeModal: () => {},
});

export const WalletContextProvider = ({ children }: any) => {
  console.log('Render WalletContext');
  const { selectedChainItem } = useConfig();
  const signTransactionModal = useRef<any>();
  const signMessageModal = useRef<any>();
  const receiveModal = useRef<any>();
  const sendModal = useRef<any>();

  const [activeModal, setActiveModal] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const openModal = (activeModal: any) => {
    setActiveModal(activeModal)
    onOpen()
  }

  const closeModal = () => {
    setActiveModal(null)
    onClose()
  }

  const ethersProvider = useMemo(() => {
    console.log('trigger ethers provider');
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);


  const showSignTransaction = async (txns: any, origin?: string, sendTo?: string) => {
    return await signTransactionModal.current.show(txns, origin, sendTo);
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

  return (
    <WalletContext.Provider
      value={{
        ethersProvider,
        showSignMessage,
        showReceive,
        showSend,
        isModalOpen: isOpen,
        activeModal,
        openModal,
        closeModal
      }}
    >
      {children}
      {/** todo, move to another component **/}
      <SignMessageModal ref={signMessageModal} />
      <ReceiveModal ref={receiveModal} />
      <SendModal ref={sendModal} />
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
