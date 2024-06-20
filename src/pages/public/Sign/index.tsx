import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, PopoverTrigger, Link, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure  } from '@chakra-ui/react';
import IconLogo from '@/assets/logo-all-v3.svg';
import RoundContainer from '@/components/new/RoundContainer';
import Button from '@/components/mobile/Button'
import { useSignTypedData, useSwitchChain } from 'wagmi';
import { SocialRecovery } from '@soulwallet/sdk';
import api from '@/lib/api';
import useConfig from '@/hooks/useConfig';
import SignatureRequestImg from '@/assets/icons/signature-request.svg';
import { useParams } from 'react-router-dom';
import WarningIcon from '@/components/Icons/Warning';
import OpenIcon from '@/components/Icons/mobile/Open';
import SuccessIcon from '@/components/Icons/Success';
import ConnectWalletModal from '@/components/ConnectWalletModal';
import useWagmi from '@/hooks/useWagmi';
import IconOp from '@/assets/chains/op.svg';
import OpIcon from '@/assets/mobile/op.png'
import useScreenSize from '@/hooks/useScreenSize'

const validateSigner = (recoveryRecord: any, address: any) => {
  if (!recoveryRecord) return;
  const guardians = recoveryRecord.guardianInfo.guardians;
  console.log('validateSigner', guardians, String(address).toLowerCase());
  return !!guardians && guardians.indexOf(String(address).toLowerCase()) !== -1;
};

const checkSigned = (recoveryRecord: any, address: any) => {
  if (!recoveryRecord) return;
  const guardianSignatures = recoveryRecord.guardianSignatures;
  return guardianSignatures.map((item: any) => item.guardian).includes(String(address).toLowerCase());
};

export const SignHeader = ({ url }: { url?: string }) => {
  return (
    <Box height="58px" pos="absolute" top="0" left={'0'} right={'0'} padding="10px 20px">
      <Link
        display="inline-block"
        {...(url
           ? {
             href: url,
           }
           : {
             cursor: 'default',
        })}
      >
        <Image src={IconLogo} h="44px" />
      </Link>
    </Box>
  );
};

export const SignContainer = ({ children, isOpen, onOpen, onClose }: any) => {
  const { innerHeight } = useScreenSize()
  const marginHeight = innerHeight - 350

  return (
    <Flex
      justify="center"
      align="center"
      width="100%"
      minHeight="100vh"
      background="white"
    >
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 58px)"
        flexDirection="column"
        width="100%"
      >
        {children}
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
          height="350px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" width="100%">
            <Box fontSize="16px" fontWeight="600" lineHeight="40px">
              Connect a wallet
            </Box>
            <Box width="100%" display="flex" flexWrap="wrap">
              <Box width="50%">
                <Box width="calc(100% - 8px)" background="rgba(0, 0, 0, 0.05)" borderRadius="12px" height="64px" display="flex" alignItems="center" padding="8px 10px" marginTop="16px">
                  <Box marginRight="8px" width="48px" height="48px" borderRadius="12px" background="white" border="1px solid rgba(0, 0, 0, 0.1)">

                  </Box>
                  <Box fontSize="14px" fontWeight="500">Browser wallet</Box>
                </Box>
              </Box>
              <Box width="50%">
                <Box width="calc(100% - 8px)" background="rgba(0, 0, 0, 0.05)" borderRadius="12px" height="64px" display="flex" alignItems="center" padding="8px 10px" marginTop="16px" marginLeft="auto">
                  <Box marginRight="8px" width="48px" height="48px" borderRadius="12px" background="white" border="1px solid rgba(0, 0, 0, 0.1)">

                  </Box>
                  <Box fontSize="14px" fontWeight="500">Wallet connect</Box>
                </Box>
              </Box>
              <Box width="50%">
                <Box width="calc(100% - 8px)" background="rgba(0, 0, 0, 0.05)" borderRadius="12px" height="64px" display="flex" alignItems="center" padding="8px 10px" marginTop="16px">
                  <Box marginRight="8px" width="48px" height="48px" borderRadius="12px" background="white" border="1px solid rgba(0, 0, 0, 0.1)">

                  </Box>
                  <Box fontSize="14px" fontWeight="500">Metamask</Box>
                </Box>
              </Box>
              <Box width="50%">
                <Box width="calc(100% - 8px)" background="rgba(0, 0, 0, 0.05)" borderRadius="12px" height="64px" display="flex" alignItems="center" padding="8px 10px" marginTop="16px" marginLeft="auto">
                  <Box marginRight="8px" width="48px" height="48px" borderRadius="12px" background="white" border="1px solid rgba(0, 0, 0, 0.1)">

                  </Box>
                  <Box fontSize="14px" fontWeight="500">OKX Wallet</Box>
                </Box>
              </Box>
              <Box width="50%">
                <Box width="calc(100% - 8px)" background="rgba(0, 0, 0, 0.05)" borderRadius="12px" height="64px" display="flex" alignItems="center" padding="8px 10px" marginTop="16px">
                  <Box marginRight="8px" width="48px" height="48px" borderRadius="12px" background="white" border="1px solid rgba(0, 0, 0, 0.1)">

                  </Box>
                  <Box fontSize="14px" fontWeight="500">Coinbase Wallet</Box>
                </Box>
              </Box>
              <Box width="50%">
                <Box width="calc(100% - 8px)" background="rgba(0, 0, 0, 0.05)" borderRadius="12px" height="64px" display="flex" alignItems="center" padding="8px 10px" marginTop="16px" marginLeft="auto">
                  <Box marginRight="8px" width="48px" height="48px" borderRadius="12px" background="white" border="1px solid rgba(0, 0, 0, 0.1)">

                  </Box>
                  <Box fontSize="14px" fontWeight="500">Binance Wallet</Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default function Sign() {
  const { recoverId } = useParams();
  const [recoveryRecord, setRecoveryRecord] = useState<any>();
  const [signing, setSigning] = useState(false);
  const { chainConfig } = useConfig();
  const [loaded, setLoaded] = useState(true);
  const [isSigned, setIsSigned] = useState<any>(false);
  const toast = useToast();
  const { switchChain } = useSwitchChain();
  const { signTypedDataAsync } = useSignTypedData();
  const {
    connectEOA,
    isConnected,
    isConnectOpen,
    openConnect,
    closeConnect,
    address,
    isConnecting,
    chainId: connectedChainId,
  } = useWagmi();

  const isValidSigner = validateSigner(recoveryRecord, address)
  const recoveryAddress = recoveryRecord && recoveryRecord.address
  const targetChainName = 'Optimism Sepolia'
  console.log('recoverId', recoveryRecord, isSigned);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { innerHeight } = useScreenSize()
  const marginHeight = innerHeight - 350

  const loadRecord = async (recoverId: any) => {
    try {
      const res = await api.recovery.getRecord({ recoveryID: recoverId });
      const recoveryRecord = res.data;
      setLoaded(true);
      setRecoveryRecord(recoveryRecord);
    } catch (error: any) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    setIsSigned(checkSigned(recoveryRecord, address));
  }, [recoveryRecord, address]);

  useEffect(() => {
    if (recoverId) {
      loadRecord(recoverId);
      const interval = setInterval(() => loadRecord(recoverId), 5000);
      return () => clearInterval(interval);
    }
  }, [recoverId]);

  const sign = useCallback(async () => {
    try {
      if (!recoveryRecord) return;

      setSigning(true);

      const typedDataToSign:any = SocialRecovery.getSocialRecoveryTypedData(
        recoveryRecord.chainID,
        chainConfig.contracts.socialRecoveryModule,
        recoveryRecord.address,
        recoveryRecord.nonce,
        recoveryRecord.newOwners,
      )

      typedDataToSign.domain.chainId = parseInt(typedDataToSign.domain.chainId)

      // const signer:any = await ethersSigner;
      const signature = await signTypedDataAsync(typedDataToSign);

      const res: any = await api.recovery.guardianSign({
        recoveryID: recoverId,
        guardian: address,
        signature: signature,
      });

      if (res.code === 200) {
        toast({
          title: 'Signed',
          status: 'success',
        });
        setIsSigned(true);
      }
      setSigning(false);
    } catch (error: any) {
      setSigning(false);
      let message = error.message;

      if (message && message.indexOf('user rejected action') !== -1) {
        message = 'User rejected action';
      }

      toast({
        title: message,
        status: 'error',
      });
      console.log('error', message);
    }
  }, [recoveryRecord, address]);

  const targetChainId = parseInt(recoveryRecord?.chainID);

  console.log('target chain', targetChainId)

  if (!loaded) {
    return (
      <SignContainer>
        <Box width={{ base: '100%', md: '100%' }} flex="1" display="flex" padding="60px">
          <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box
              maxWidth="548px"
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box fontSize="32px" fontWeight="700" lineHeight={'normal'}>
                Loading...
              </Box>
            </Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (!!isSigned) {
    return (
      <SignContainer>
        <Box
          width="120px"
          height="120px"
          borderRadius="120px"
          margin="0 auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <SuccessIcon size="120" />
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="700"
          marginTop="20px"
        >
          Signature received
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
        >
          Thank you! Your signature is received.
        </Box>
        <Box
          width="100%"
          background="#F8F8F8"
          borderRadius="12px"
          padding="12px"
          marginTop="18px"
        >
          <Box
            color="rgba(0, 0, 0, 0.8)"
            fontSize="12px"
            fontWeight="600"
            display="flex"
            alignItems="center"
            marginBottom="12px"
          >
            <Box>Wallet to recover:</Box>
          </Box>
          <Box
            fontSize="13px"
            fontWeight="600"
          >
            <Box as="span" color="black">0x8d34</Box>
            <Box as="span" color="rgba(0, 0, 0, 0.4)">947d8cba2abd7e8d5b788c8a3674325c93d1</Box>
            <Box as="span" color="black">5c93d1</Box>
          </Box>
          <Box
            borderRadius="4px"
            background="white"
            display="flex"
            width="fit-content"
            padding="4px"
            marginTop="18px"
          >
            <Box marginRight="4px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            <Box fontWeight="600" fontSize="14px">Optimism</Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (!!isConnected && !isValidSigner) {
    return (
      <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Box
          width="120px"
          height="120px"
          borderRadius="120px"
          margin="0 auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <WarningIcon size="80" />
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="700"
          marginTop="20px"
        >
          Not the guardian
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
        >
          The wallet you connected is not the guardian for the recovery wallet. Please double check.
        </Box>
        <Button size="xl" type="blue" width="100%" marginTop="30px" onClick={onOpen}>Connect another wallet</Button>
        <Box marginTop="18px" height="42px" borderRadius="22px" padding="10px 12px" background="#F8F8F8">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box marginRight="8px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            <Box fontWeight="600" fontSize="14px" marginRight="4px">Wallet_1</Box>
            <Box fontSize="14px">(0x081…B7F89)</Box>
            <Box width="1px" height="20px" background="#E2E2E2" marginLeft="10px" marginRight="10px"></Box>
            <Box><OpenIcon /></Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (!!isConnected && connectedChainId !== targetChainId) {
    return (
      <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Box
          width="120px"
          height="120px"
          borderRadius="120px"
          margin="0 auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <WarningIcon size="80" />
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="700"
          marginTop="20px"
        >
          Switch network
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
        >
          The wallet you connected is not on the Optism network, please switch network to continue sign,
        </Box>
        <Button size="xl" type="blue" width="100%" marginTop="30px" onClick={() => switchChain({ chainId: targetChainId })}>
          Switch to {targetChainName} network
        </Button>
        <Box marginTop="18px" height="42px" borderRadius="22px" padding="10px 12px" background="#F8F8F8">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box marginRight="8px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            <Box fontWeight="600" fontSize="14px" marginRight="4px">Wallet_1</Box>
            <Box fontSize="14px">(0x081…B7F89)</Box>
            <Box width="1px" height="20px" background="#E2E2E2" marginLeft="10px" marginRight="10px"></Box>
            <Box><OpenIcon /></Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (isConnected) {
    return (
      <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Box
          width="120px"
          height="120px"
          borderRadius="120px"
          margin="0 auto"
          background="#F2F2F2"
          opacity="0.55"
        >
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="700"
          marginTop="20px"
        >
          Recover request
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
        >
          Your friend's wallet is lost. As their guardian, please connect your wallet and confirm request to assist with their wallet recovery.
        </Box>
        <Box
          width="100%"
          background="#F8F8F8"
          borderRadius="12px"
          padding="12px"
          marginTop="18px"
        >
          <Box
            color="rgba(0, 0, 0, 0.8)"
            fontSize="12px"
            fontWeight="600"
            display="flex"
            alignItems="center"
            marginBottom="12px"
          >
            <Box>Wallet to recover:</Box>
          </Box>
          <Box
            fontSize="13px"
            fontWeight="600"
          >
            <Box as="span" color="black">0x8d34</Box>
            <Box as="span" color="rgba(0, 0, 0, 0.4)">947d8cba2abd7e8d5b788c8a3674325c93d1</Box>
            <Box as="span" color="black">5c93d1</Box>
          </Box>
          <Box
            borderRadius="4px"
            background="white"
            display="flex"
            width="fit-content"
            padding="4px"
            marginTop="18px"
          >
            <Box marginRight="4px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            <Box fontWeight="600" fontSize="14px">Optimism</Box>
          </Box>
        </Box>
        <Button size="xl" type="blue" width="100%" marginTop="30px" onClick={onOpen}>Connect Wallet</Button>
        <Box marginTop="18px" height="42px" borderRadius="22px" padding="10px 12px" background="#F8F8F8">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box marginRight="8px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            <Box fontWeight="600" fontSize="14px" marginRight="4px">Wallet_1</Box>
            <Box fontSize="14px">(0x081…B7F89)</Box>
            <Box width="1px" height="20px" background="#E2E2E2" marginLeft="10px" marginRight="10px"></Box>
            <Box><OpenIcon /></Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  return (
    <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <Box
        width="120px"
        height="120px"
        borderRadius="120px"
        margin="0 auto"
        background="#F2F2F2"
        opacity="0.55"
      >
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="700"
        marginTop="20px"
      >
        Recover request
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="20px"
      >
        Your friend's wallet is lost. As their guardian, please connect your wallet and confirm request to assist with their wallet recovery.
      </Box>
      <Box
        width="100%"
        background="#F8F8F8"
        borderRadius="12px"
        padding="12px"
        marginTop="18px"
      >
        <Box
          color="rgba(0, 0, 0, 0.8)"
          fontSize="12px"
          fontWeight="600"
          display="flex"
          alignItems="center"
          marginBottom="12px"
        >
          <Box>Wallet to recover:</Box>
        </Box>
        <Box
          fontSize="13px"
          fontWeight="600"
        >
          <Box as="span" color="black">0x8d34</Box>
          <Box as="span" color="rgba(0, 0, 0, 0.4)">947d8cba2abd7e8d5b788c8a3674325c93d1</Box>
          <Box as="span" color="black">5c93d1</Box>
        </Box>
        <Box
          borderRadius="4px"
          background="white"
          display="flex"
          width="fit-content"
          padding="4px"
          marginTop="18px"
        >
          <Box marginRight="4px">
            <Image width="20px" height="20px" src={OpIcon} />
          </Box>
          <Box fontWeight="600" fontSize="14px">Optimism</Box>
        </Box>
      </Box>
      <Button size="xl" type="blue" width="100%" marginTop="30px" onClick={onOpen}>Connect Wallet</Button>
    </SignContainer>
  );
}
