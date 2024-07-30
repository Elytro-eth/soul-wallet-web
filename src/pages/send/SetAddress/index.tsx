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
import { isAddress } from 'ethers';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver';
import useScreenSize from '@/hooks/useScreenSize';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';

export default function SetAddress({ isModal, onPrev, onNext, sendTo, setSendTo }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedAddress } = useAddressStore();
  const [isENSOpen, setIsENSOpen] = useState(false);
  const [isENSLoading, setIsENSLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const { chainConfig } = useConfig();
  const [resolvedAddress, setResolvedAddress] = useState('');
  // const [step, setStep] = useState(0);
  // const [isSending, setIsSending] = useState(false);
  // const [isSent, setIsSent] = useState(false);
  const { innerHeight } = useScreenSize();
  const marginHeight = innerHeight - 468;

  const onAddressChange = (val: string) => {
    setSendTo(val);
    setSearchText(val);

    if (extractENSAddress(val)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  };

  const activeENSNameRef = useRef();
  const menuRef = useRef();
  const inputRef = useRef<any>();

  const inputOnFocus = (value: any) => {
    setSearchText(value);

    if (extractENSAddress(value)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  };

  const setMenuRef = (value: any) => {
    menuRef.current = value;
  };

  const setInputRef = (value: any) => {
    inputRef.current = value;
  };

  const setActiveENSNameRef = (value: any) => {
    activeENSNameRef.current = value;
  };

  const getActiveENSNameRef = (value: any) => {
    return activeENSNameRef.current;
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        inputRef.current &&
        !(inputRef.current as any).contains(event.target) &&
        menuRef.current &&
        !(menuRef.current as any).contains(event.target)
      ) {
        setIsENSOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBlur = () => {
    const input = inputRef.current;
    if (input) {
      input.scrollLeft = input.scrollWidth;
    }
  };

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress);
    setSendTo(resolvedAddress);
    // setErrors(({ receiverAddress, ...rest }: any) => rest);
    setIsENSOpen(false);
  };

  const isInvalidNetwork = sendTo && sendTo.includes(':') && `${sendTo.split(':')[0]}:` !== chainConfig.chainPrefix;

  const isSelf = sendTo.toLowerCase() === selectedAddress.toLowerCase();

  const disabled = !sendTo || isSelf || (sendTo.includes(':') ? isInvalidNetwork : !isAddress(sendTo));

  console.log('sendto is', sendTo.split(':')[0], chainConfig.chainPrefix);

  return (
    <Box width="100%" height={innerHeight} overflowY="scroll">
      <Header title="" showBackButton={!isModal} onBack={onPrev} />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        <Box fontSize="28px" fontWeight="500" color="#161F36">
          Send
        </Box>
        <Box pos={'relative'} marginTop="24px">
          <Box>
            <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C">
              To
            </Box>
            <Box paddingTop="10px" display="flex" alignItems="center" position="relative">
              <Input
                onChange={(e) => onAddressChange(e.target.value)}
                onFocus={(e: any) => inputOnFocus(e.target.value)}
                value={sendTo}
                ref={setInputRef}
                height="56px"
                onBlur={handleBlur}
                spellCheck={false}
                fontSize="20px"
                lineHeight="24px"
                fontWeight="400"
                // autoFocus
                placeholder="Enter wallet address or ENS"
                border="none"
                outline="none"
                background="#F2F3F5"
                padding="16px"
                borderRadius="16px"
                color="#161F36"
                _focusVisible={{ border: 'none', boxShadow: 'none' }}
              />
              <ENSResolver
                _styles={{
                  width: '100%',
                  top: '75px',
                  left: '0',
                  right: '0',
                  borderRadius: '12px',
                }}
                isENSOpen={isENSOpen}
                setIsENSOpen={setIsENSOpen}
                isENSLoading={isENSLoading}
                setIsENSLoading={setIsENSLoading}
                searchText={searchText}
                setSearchText={setSearchText}
                searchAddress={searchAddress}
                setSearchAddress={setSearchAddress}
                resolvedAddress={resolvedAddress}
                setResolvedAddress={setResolvedAddress}
                setMenuRef={setMenuRef}
                submitENSName={submitENSName}
                setActiveENSNameRef={setActiveENSNameRef}
                getActiveENSNameRef={getActiveENSNameRef}
              />
            </Box>
          </Box>
          {sendTo && disabled && (
            <Box
              display="flex"
              bottom="-20px"
              position="absolute"
              alignItems="center"
              justifyContent="flex-start"
              marginTop="5px"
            >
              <Box fontWeight="400" fontSize="14px" lineHeight="15px" color="#E8424C">
                {isSelf
                  ? 'You cannot send to yourself'
                  : isInvalidNetwork
                    ? 'Invalid network'
                    : disabled
                      ? 'Invalid wallet address'
                      : ''}
              </Box>
            </Box>
          )}
        </Box>
        <Box fontSize="14px" fontWeight="400" color="#95979C" marginTop="32px" lineHeight="17.5px">
          Network
        </Box>
        <Box onClick={onOpen} marginTop="8px" display="flex" alignItems="center">
          <Box marginRight="8px">
            <Image w="32px" h="32px" src={OpIcon} />
          </Box>
          <Box fontSize="20px" fontWeight="500">
            {chainConfig.chainName}
          </Box>
          <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center">
            <QuestionIcon />
          </Box>
        </Box>
        <Box marginTop="40px" width="100%">
          <Button disabled={disabled} size="xl" type="gradientBlue" width="100%" onClick={onNext}>
            Continue
          </Button>
        </Box>
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
            md: 'calc(50vh - 234px)',
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
    </Box>
  );
}
