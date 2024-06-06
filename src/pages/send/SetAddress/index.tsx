import { useEffect, useRef, useState, useCallback, Fragment } from 'react'
import { Box, Input, Image, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import QuestionIcon from '@/components/Icons/Question'
import SendingIcon from '@/components/Icons/mobile/Sending'
import SentIcon from '@/components/Icons/mobile/Sent'
import { useBalanceStore } from '@/store/balance';
import BN from 'bignumber.js'
import OpIcon from '@/assets/mobile/op.png'
import USDCIcon from '@/assets/mobile/usdc.png'
import { toFixed } from '@/lib/tools';
import { isAddress } from 'ethers';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver';

export default function SetAddress({ isModal, onPrev, onNext, sendTo, setSendTo, }: any) {
  const [withdrawAmount, setWithdrawAmount] = useState<any>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { totalUsdValue, } = useBalanceStore();
  const [isENSOpen, setIsENSOpen] = useState(false);
  const [isENSLoading, setIsENSLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [step, setStep] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 468

  const onAddressChange = (val: string) => {
    setSendTo(val);
    setSearchText(val);

    if (extractENSAddress(val)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  }


  const activeENSNameRef = useRef();
  const menuRef = useRef();
  const inputRef = useRef();

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

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress);
    setSendTo(resolvedAddress)
    // setErrors(({ receiverAddress, ...rest }: any) => rest);
    setIsENSOpen(false);
  };

  const disabled = (step === 0) ? (!isAddress(sendTo)) : (!withdrawAmount || withdrawAmount <= 0 || !sendTo || BN(withdrawAmount).isGreaterThan(totalUsdValue) || BN(withdrawAmount).isNaN())

  return (
    <Box width="100%" height={innerHeight} overflowY="scroll">
      <Header
        title=""
        showBackButton={!isModal}
        onBack={onPrev}
      />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        <Box fontSize="32px" fontWeight="700">
          Recipient
        </Box>
        <Box marginTop="60px">
          <Box
            fontSize="14px"
            fontWeight="700"
            opacity="0.4"
          >
            To
          </Box>
          <Box
            borderBottom="1px solid rgba(73, 126, 130, 0.2)"
            padding="10px 0"
            display="flex"
            alignItems="center"
            position="relative"
          >
            <Input
              value={sendTo}
              spellCheck={false}
              onChange={e => onAddressChange(e.target.value)}
              onFocus={(e: any) => inputOnFocus(e.target.value)}
              ref={setInputRef}
              fontSize="18px"
              lineHeight="100%"
              padding="0"
              fontWeight="700"
              placeholder="Enter wallet address or ENS"
              borderRadius="0"
              border="none"
              outline="none"
              _focusVisible={{ border: 'none', boxShadow: 'none' }}
            />
            <ENSResolver
              _styles={{
                width: '100%',
                top: '65px',
                left: '0',
                right: '0',
                borderRadius: '12px'
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
        <Box
          fontSize="14px"
          fontWeight="700"
          opacity="0.4"
          marginTop="40px"
        >
          Network
        </Box>
        <Box onClick={onOpen} marginTop="8px" display="flex" alignItems="center">
          <Box marginRight="8px"><Image w="32px" h="32px" src={OpIcon} /></Box>
          <Box fontSize="20px" fontWeight="600">Optimism</Box>
          <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center"><QuestionIcon /></Box>
        </Box>
        <Box
          marginTop="40px"
          width="100%"
        >
          <Button disabled={false} size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px'
          }}
          marginTop={{
            sm: `${marginHeight}px`,
            md: 'calc(50vh - 125px)'
          }}
          height="468px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box
              background="#D9D9D9"
              height="80px"
              width="80px"
              borderRadius="80px"
              marginBottom="30px"
            >
              <Image src={OpIcon} />
            </Box>
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Optimism network
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="40px"
            >
              Optimism is a Layer-2 scaling network for Ethereum that operates under a four-pillar design philosophy of simplicity, pragmatism, sustainability, and optimism.
            </Box>
            <Box width="100%">
              <Button size="xl" type="blue" width="100%" onClick={onClose}>Got it</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
