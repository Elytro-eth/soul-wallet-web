import { useEffect, useRef, useState, useCallback, Fragment } from 'react';
import {
  Box,
  Input,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import Header from '@/components/mobile/Header';
import QuestionIcon from '@/components/Icons/Question';
import SendingIcon from '@/components/Icons/mobile/Sending';
import SentIcon from '@/components/Icons/mobile/Sent';
import { useBalanceStore } from '@/store/balance';
import BN from 'bignumber.js';
import OpIcon from '@/assets/mobile/op.png';
import USDCIcon from '@/assets/mobile/usdc.png';
import { toFixed } from '@/lib/tools';
import { ZeroAddress, isAddress } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
import useTools from '@/hooks/useTools';
import useConfig from '@/hooks/useConfig';

export default function Review({ onPrev, amount, sendTo, tokenAddress, isModal }: any) {
  const { closeModal, closeFullScreenModal } = useWalletContext();
  const { chainConfig } = useConfig();
  const { signAndSend, getTransferEthOp, getTransferErc20Op } = useWallet();
  const [isSent, setIsSent] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { doCopy } = useTools();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const executingRef = useRef(false);
  const userOpRef = useRef();
  const isCompletedRef = useRef(false);
  const isTransferingRef = useRef(false);
  const innerHeight = window.innerHeight;
  const marginHeight = innerHeight - 468;

  const [animated, setAnimated] = useState(false);
  const [completed, setCompleted] = useState(false);

  const prepareAction = async () => {
    try {
      if (tokenAddress === ZeroAddress) {
        const _userOp = await getTransferEthOp(amount, sendTo);
        userOpRef.current = _userOp;
      } else {
        const _userOp = await getTransferErc20Op(amount, sendTo, tokenAddress);
        userOpRef.current = _userOp;
      }
    } catch (e) {
      // user may reach limit of gas sponsor
      executingRef.current = false;
      isTransferingRef.current = false;
      closeModal();
    }
  };

  useEffect(() => {
    prepareAction();
    const interval = setInterval(() => {
      if (isTransferingRef.current || isCompletedRef.current) {
        return;
      }
      prepareAction();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const onTransfer = async (skipExecutingCheck = false) => {
    isTransferingRef.current = true;
    if (executingRef.current && !skipExecutingCheck) {
      return;
    }
    executingRef.current = true;
    isTransferingRef.current = true;
    if (userOpRef.current) {
      try {
        setIsSending(true);
        const res:any = await signAndSend(userOpRef.current);
        console.log('tx result', res)
        setTxHash(res.transactionHash)
        isTransferingRef.current = false;
        isCompletedRef.current = true;
        setAnimated(false);
        setIsSent(true);
        setCompleted(true);
        console.log('setAnimated false');

        setTimeout(() => {
          setAnimated(true);
          console.log('setAnimated true');
        }, 1300);
      } catch (e) {
        // setExecuting(false);
        executingRef.current = false;
        isTransferingRef.current = false;
        isCompletedRef.current = false;
      }
    } else {
      executingRef.current = false;
      setTimeout(() => {
        onTransfer(true);
      }, 1000);
    }
  };

  return (
    <Box width="100%" height={innerHeight} overflowY="scroll">
      <Header title="" showBackButton={!isModal} onBack={onPrev} />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        {isSent && (
          <Box fontSize="32px" fontWeight="700" display="flex" alignItems="center">
            <Box marginRight="12px">
              <SentIcon />
            </Box>
            Completed
          </Box>
        )}
        {isSending && !isSent && (
          <Box fontSize="32px" fontWeight="700" display="flex" alignItems="center">
            <Box marginRight="12px">
              <SendingIcon />
            </Box>
            Sending
          </Box>
        )}
        {!isSending && !isSent && (
          <Box fontSize="32px" fontWeight="700">
            Review
          </Box>
        )}
        <Box marginTop="60px">
          <Box fontSize="14px" fontWeight="700" opacity="0.4">
            Send
          </Box>
          <Box marginTop="8px" display="flex" alignItems="center">
            <Box marginRight="8px">
              <Image w="32px" h="32px" src={USDCIcon} />
            </Box>
            <Box fontSize="24px" fontWeight="600">
              {amount} ETH
            </Box>
          </Box>

          <Box padding="10px 0" display="flex" alignItems="center" position="relative"></Box>
        </Box>
        <Box marginTop="60px">
          <Box fontSize="14px" fontWeight="700" opacity="0.4">
            To
          </Box>
          <Box marginTop="8px" alignItems="center" width="100%" display="inline-block">
            <Box as="span" fontSize="24px" fontWeight="600">
              0x8d34
            </Box>
            <Box as="span" fontSize="24px" fontWeight="600" color="rgba(0, 0, 0, 0.4)">
              947d8cba2abd7e8d5b788c8a3674325c93d1
            </Box>
            <Box as="span" fontSize="24px" fontWeight="600">
              5c93d1
            </Box>
          </Box>

          <Box padding="10px 0" display="flex" alignItems="center" position="relative"></Box>
        </Box>
        <Box fontSize="14px" fontWeight="700" opacity="0.4" marginTop="40px">
          Network
        </Box>
        <Box onClick={onOpen} marginTop="8px" display="flex" alignItems="center">
          <Box marginRight="8px">
            <Image w="32px" h="32px" src={OpIcon} />
          </Box>
          <Box fontSize="20px" fontWeight="600">
            Optimism
          </Box>
          <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center">
            <QuestionIcon />
          </Box>
        </Box>
        <Box fontSize="14px" fontWeight="700" opacity="0.4" marginTop="40px">
          Fee
        </Box>
        <Box marginTop="8px" display="flex" alignItems="center">
          <Box fontSize="20px" fontWeight="600">
            $0
          </Box>
        </Box>
        {isSent && (
          <Box marginTop="40px" width="100%">
            <Box width="100%" marginBottom="20px">
              <Button width="calc(100%)" size="xl" type="blue" onClick={()=> closeFullScreenModal()}>
                Done
              </Button>
            </Box>
            <Box width="100%">
              <Button width="calc(100%)" onClick={()=>doCopy(`${chainConfig.scanUrl}/tx/${txHash}`)} size="xl" type="white">
                Copy transaction link
              </Button>
            </Box>
          </Box>
        )}
        {!isSent && (
          <Box marginTop="40px" width="100%" display="flex">
            <Box width="50%" paddingRight="7px">
              <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">
                Back
              </Button>
            </Box>
            <Box width="50%" paddingLeft="7px">
              <Button width="calc(100% - 7px)" disabled={false} size="xl" type="blue" onClick={() => onTransfer()}>
                Continue
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px',
          }}
          marginTop={{
            sm: `${marginHeight}px`,
            md: 'calc(50vh - 125px)',
          }}
          height="468px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <Box background="#D9D9D9" height="80px" width="80px" borderRadius="80px" marginBottom="30px">
              <Image src={OpIcon} />
            </Box>
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Optimism network
            </Box>
            <Box fontSize="16px" textAlign="center" marginBottom="40px">
              Optimism is a Layer-2 scaling network for Ethereum that operates under a four-pillar design philosophy of
              simplicity, pragmatism, sustainability, and optimism.
            </Box>
            <Box width="100%">
              <Button size="xl" type="blue" width="100%" onClick={onClose}>
                Got it
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
