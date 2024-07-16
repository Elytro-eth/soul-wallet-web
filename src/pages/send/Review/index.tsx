import { useEffect, useRef, useState, useCallback, Fragment } from 'react';
import {
  Box,
  Input,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Link,
  Flex,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import Header from '@/components/mobile/Header';
import QuestionIcon from '@/components/Icons/Question';
import IconChevronRight from '@/assets/icons/chevron-right-fee.svg';
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
import useScreenSize from '@/hooks/useScreenSize';
import FadeId from '@/components/Icons/mobile/FaceId';
import Circle from '@/components/Icons/mobile/Circle';

export default function Review({ onPrev, amount, sendTo, tokenAddress, isModal, selectedToken }: any) {
  const { closeModal, closeFullScreenModal } = useWalletContext();
  const { chainConfig } = useConfig();
  const { signAndSend, getTransferEthOp, getTransferErc20Op } = useWallet();
  const [isSent, setIsSent] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { doCopy } = useTools();
  const [useSponsor, setUseSponsor] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { getTokenBalance } = useBalanceStore();
  const executingRef = useRef(false);
  const userOpRef = useRef();
  const isCompletedRef = useRef(false);
  const isTransferingRef = useRef(false);
  const { innerHeight } = useScreenSize();
  const marginHeight = innerHeight - 468;
  const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();

  const [animated, setAnimated] = useState(false);
  const [completed, setCompleted] = useState(false);

  const prepareAction = async () => {
    try {
      if (tokenAddress === ZeroAddress) {
        const _userOp = await getTransferEthOp(String(amount), sendTo, !useSponsor);
        userOpRef.current = _userOp;
      } else {
        const _userOp = await getTransferErc20Op(String(amount), sendTo, !useSponsor, tokenAddress);
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
    setIsSending(true);
    isTransferingRef.current = true;
    if (executingRef.current && !skipExecutingCheck) {
      return;
    }
    executingRef.current = true;
    isTransferingRef.current = true;
    if (userOpRef.current) {
      try {
        const res: any = await signAndSend(userOpRef.current);
        console.log('tx result', res);
        setTxHash(res.transactionHash);
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
        setIsSending(false);
        onPrev();
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
          <Box fontSize="28px" fontWeight="500" display="flex" alignItems="center" color="#161F36">
            <Box marginRight="12px">
              <SentIcon />
            </Box>
            Completed
          </Box>
        )}
        {isSending && !isSent && (
          <Box fontSize="28px" fontWeight="500" display="flex" alignItems="center" color="#161F36">
            <Box marginRight="12px">
              <SendingIcon />
            </Box>
            Sending
          </Box>
        )}
        {!isSending && !isSent && (
          <Box fontSize="28px" fontWeight="500" color="#161F36">
            Review
          </Box>
        )}
        <Box marginTop="24px">
          <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C">
            Send
          </Box>
          <Box marginTop="8px" display="flex" alignItems="center">
            <Box marginRight="8px">
              <Image w="32px" h="32px" src={selectedToken && selectedToken.logoURI} />
            </Box>
            <Box fontSize="22px" fontWeight="500">
              {amount} {selectedToken && selectedToken.symbol}
            </Box>
          </Box>
        </Box>
        <Box marginTop="24px">
          <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C">
            To
          </Box>
          <Box
            marginTop="8px"
            alignItems="center"
            width="100%"
            fontWeight={'500'}
            display="inline-block"
            lineHeight="24.2px"
          >
            <Box as="span" fontSize="22px">
              {chainConfig.chainPrefix}
              {sendTo.slice(0, 6)}
            </Box>
            <Box as="span" fontSize="22px" color="rgba(0, 0, 0, 0.4)">
              {sendTo.slice(6, 32)}
            </Box>
            <Box as="span" fontSize="22px">
              {sendTo.slice(32)}
            </Box>
          </Box>
        </Box>
        <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C" marginTop="24px">
          Network
        </Box>
        <Box onClick={onOpen} marginTop="8px" display="flex" alignItems="center">
          <Box marginRight="8px">
            <Image w="32px" h="32px" src={OpIcon} />
          </Box>
          <Box fontSize="22px" fontWeight="500">
            Optimism
          </Box>
          <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center">
            <QuestionIcon />
          </Box>
        </Box>
        <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C" marginTop="24px">
          Fee
        </Box>
        <Box marginTop="8px" display="flex" justifyContent="center" flexDirection="column">
          <Flex gap="1" align="center" onClick={() => !isSent && onSelectOpen()}>
            <Box fontSize="22px" fontWeight="500" lineHeight="24.2px" textDecoration={useSponsor ? 'line-through' : ''}>
              $0
            </Box>
            {!isSent && <Image src={IconChevronRight} />}
          </Flex>
          <Box h="32px">
            {useSponsor && (
              <Box fontWeight="400" fontSize="12px" color="#2D3CBD">
                Sponsored by Soul Wallet
              </Box>
            )}
            {false && (
              <Box fontWeight="400" fontSize="12px" color="#E8424C">
                Insufficient ETH balance
              </Box>
            )}
          </Box>
        </Box>
        {isSent && (
          <Box marginTop="24px" width="100%">
            <Box width="100%" marginBottom="8px">
              <Button width="calc(100%)" size="xl" type="gradientBlue" onClick={() => closeFullScreenModal()}>
                Done
              </Button>
            </Box>
            <Box width="100%">
              <Button
                width="calc(100%)"
                onClick={() => doCopy(`${chainConfig.scanUrl}/tx/${txHash}`)}
                size="xl"
                type="white"
              >
                Copy transaction link
              </Button>
            </Box>
          </Box>
        )}
        {!isSent && (
          <Box marginTop="24px" width="100%" display="flex">
            {!isSending && (
              <Box width="50%" paddingRight="7px">
                <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">
                  Back
                </Button>
              </Box>
            )}
            <Box width={isSending ? '100%' : '50%'} paddingLeft="7px">
              <Button
                width="calc(100% - 7px)"
                disabled={isSending}
                size="xl"
                type="gradientBlue"
                onClick={() => onTransfer()}
              >
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box marginRight="8px">
                    <FadeId />
                  </Box>
                  <Box>{isSending ? 'Sending' : 'Continue'}</Box>
                </Box>
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '32px 32px 0 0',
            md: '32px',
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
          <ModalBody display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" width="100%">
            <Box background="#D9D9D9" height="96px" width="96px" borderRadius="80px" marginBottom="30px">
              <Image height="96px" width="96px" src={OpIcon} />
            </Box>
            <Box fontSize="28px" fontWeight="500" marginBottom="14px" color="#161F36">
              Optimism network
            </Box>
            <Box fontSize="14px" marginBottom="40px" color="#676B75">
              Optimism is a Layer-2 scaling network for Ethereum that operates under a four-pillar design philosophy of
              simplicity, pragmatism, sustainability, and optimism.
            </Box>
            <Box width="100%">
              <Button size="xl" type="black" width="100%" onClick={onClose}>
                Got it
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSelectOpen} onClose={onSelectClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
        <ModalOverlay height="100vh" background="transparent" />
        <ModalContent
          borderRadius="24px"
          justifyContent="flex-end"
          maxW={{
            sm: 'calc(100vw - 32px)',
            md: '430px',
          }}
          marginTop={{
            sm: `auto`,
            md: 'calc(50vh - 125px)',
          }}
          overflow="visible"
          mb="0"
          bottom="30px"
          position="relative"
          overflowY="scroll"
          boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
        >
          <ModalCloseButton />
          <ModalHeader fontSize="20px" fontWeight="500" color="#161F36" paddingBottom="2">
            Fee
          </ModalHeader>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            width="100%"
            paddingLeft="0"
            paddingRight="0"
          >
            <Box background="white" width="100%" padding="0 16px">
              <Box
                width="calc(100%)"
                position="relative"
                display="flex"
                alignItems="center"
                height="72px"
                background="#F2F3F5"
                borderRadius="16px"
                marginBottom="8px"
                padding="16px"
                onClick={() => {
                  setUseSponsor(true);
                  onSelectClose();
                }}
                opacity={useSponsor ? 1 : 0.6}
              >
                <Box
                  height="24px"
                  width="24px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginRight="8px"
                >
                  <Circle active={useSponsor} />
                </Box>
                <Box display="flex" justifyContent="center" flexDirection="column">
                  <Box fontWeight="500" fontSize="18px" color="#161F36">
                    Sponsored by Soul Wallet
                  </Box>
                  <Box fontWeight="400" fontSize="12px" color="#161F36">
                    Upto 0.4 ETH per day
                  </Box>
                </Box>
              </Box>
              <Box
                width="calc(100%)"
                position="relative"
                display="flex"
                alignItems="center"
                height="72px"
                background="#F2F3F5"
                borderRadius="16px"
                marginBottom="8px"
                padding="16px"
                onClick={() => {
                  setUseSponsor(false);
                  onSelectClose();
                }}
                opacity={useSponsor ? 0.6 : 1}
              >
                <Box
                  height="24px"
                  width="24px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginRight="8px"
                >
                  <Circle active={!useSponsor} />
                </Box>
                <Box display="flex" justifyContent="center" flexDirection="column">
                  <Box fontWeight="500" fontSize="18px" color="#161F36">
                    Pay with ETH
                  </Box>
                  <Box fontWeight="400" fontSize="12px" color="#161F36">
                    Balance: 0.001 ETH
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
