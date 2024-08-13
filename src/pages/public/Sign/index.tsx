import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, PopoverTrigger, Link, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure  } from '@chakra-ui/react';
import IconLogo from '@/assets/logo-all-v3.svg';
import RoundContainer from '@/components/new/RoundContainer';
import Button from '@/components/mobile/Button'
import { useSignTypedData, useSwitchChain, Connector, useConnect } from 'wagmi';
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
import OpIcon from '@/assets/mobile/op.png'
import useScreenSize from '@/hooks/useScreenSize'
import { toShortAddress } from '@/lib/tools';
import { supportedEoas } from '@/config/constants'
import { getWalletIcon } from '@/lib/tools'
import RecoverSuccessIcon from '@/assets/recover-success.png'
import OPIcon from '@/assets/op.svg'
import { chainIdConfigs } from '@/config';
import useBrowser from '@/hooks/useBrowser';

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
  const { navigate } = useBrowser();

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
        cursor="pointer"
        onClick={() => navigate('/landing')}
      >
        <Image src={IconLogo} h="44px" />
      </Link>
    </Box>
  );
};

export const SignContainer = ({ children, isOpen, onOpen, onClose, connectEOA }: any) => {
  const { innerHeight } = useScreenSize()
  const marginHeight = innerHeight - 350
  const { connectors } = useConnect();

  console.log('connectors', connectors)
  return (
    <Flex
      justify="center"
      align="center"
      width="100%"
      minHeight="100vh"
      background={{
        sm: `white`,
        md: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
      }}
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
        <Box
          background={{
            sm: `transparent`,
            md: 'white',
          }}
          width={{
            sm: `100%`,
            md: '640px',
          }}
          padding={{
            sm: `0`,
            md: '40px 64px',
          }}
          borderRadius={{
            sm: `0`,
            md: '32px',
          }}
          maxHeight="100%"
          overflowY="auto"
        >
          {children}
        </Box>
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
            md: 'calc(50vh - 175px)',
          }}
          height="350px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" width="100%">
            <Box fontSize="16px" fontWeight="500" lineHeight="40px">
              Connect a wallet
            </Box>
            <Box width="100%" display="flex" flexWrap="wrap">
              {connectors.filter(item => supportedEoas.includes(item.id)).map((connector: Connector) =>
                <Box width="50%" onClick={() => { onClose(); connectEOA(connector) }} key={connector.uid}>
                  <Box width="calc(100% - 8px)" background="rgba(0, 0, 0, 0.05)" borderRadius="12px" height="64px" display="flex" alignItems="center" padding="8px 10px" marginTop="16px">
                    <Box marginRight="8px" width="48px" height="48px" borderRadius="12px" background="white" border="1px solid rgba(0, 0, 0, 0.1)" display="flex" alignItems="center" justifyContent="center">
                      <Image width="32px" src={getWalletIcon(connector.id)} />
                    </Box>
                    <Box fontSize="14px" fontWeight="500">{connector.id === 'injected' ? 'Browser Wallet' : connector.name}</Box>
                  </Box>
                </Box>
              )}
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
    disconnectEOA,
    isConnectOpen,
    openConnect,
    closeConnect,
    address,
    isConnecting,
    chainId: connectedChainId,
  } = useWagmi();

  const isValidSigner = validateSigner(recoveryRecord, address)
  const recoveryAddress = recoveryRecord && recoveryRecord.address
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

  const targetChainName = chainIdConfigs[targetChainId]?.chainName;

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
              <Box fontSize="32px" fontWeight="500" lineHeight={'normal'}>
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
          display="flex"
          alignItems="center"
          justifyContent="center"
          margin="0 auto"
        >
          <SuccessIcon size="96" />
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="500"
          marginTop="20px"
          color="#161F36"
        >
          Signature received
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
          color="#676B75"
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
            fontWeight="500"
            display="flex"
            alignItems="center"
            marginBottom="12px"
          >
            <Box>Wallet to recover:</Box>
          </Box>
          <Box
            fontSize="13px"
            fontWeight="500"
          >
            <Box as="span" color={chainConfig.chainColor}>{chainConfig.chainPrefix}</Box>
            <Box as="span" color="black">{recoveryAddress && recoveryAddress.slice(0, 6)}</Box>
            <Box as="span" color="#95979C">{recoveryAddress && recoveryAddress.slice(6, -6)}</Box>
            <Box as="span" color="black">{recoveryAddress && recoveryAddress.slice(-6)}</Box>
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
              <Image width="20px" height="20px" src={chainConfig.icon} />
            </Box>
            <Box fontWeight="500" fontSize="14px">{chainConfig.chainName}</Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (!!isConnected && !isValidSigner) {
    return (
      <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose} connectEOA={connectEOA} isConnecting={isConnecting}>
        <Box
          width="120px"
          height="120px"
          borderRadius="120px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          margin="0 auto"
        >
          <WarningIcon size="96" />
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="500"
          marginTop="20px"
          color="#161F36"
        >
          Not the recovery contact
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
          color="#676B75"
        >
          The wallet you connected is not the recovery contact for the recovery wallet. Please double check.
        </Box>
        <Button size="xl" type="gradientBlue" width="100%" marginTop="30px" onClick={() => {disconnectEOA(); onOpen()}}>Connect another wallet</Button>
        <Box marginTop="18px" height="42px" borderRadius="22px" padding="10px 12px" background="#F2F3F5" width="fit-content" marginLeft="auto" marginRight="auto">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box marginRight="8px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            {/* <Box fontWeight="500" fontSize="14px" marginRight="4px">Wallet_1</Box> */}
            <Box fontSize="14px">{toShortAddress(address)}</Box>
            <Box width="1px" height="20px" background="#E2E2E2" marginLeft="10px" marginRight="10px"></Box>
            <Box onClick={() => disconnectEOA()}><OpenIcon /></Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (!!isConnected && connectedChainId !== targetChainId) {
    return (
      <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose} connectEOA={connectEOA} isConnecting={isConnecting}>
        <Box
          width="120px"
          height="120px"
          borderRadius="120px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          margin="0 auto"
        >
          <Image height="96" src={OPIcon} />
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="500"
          marginTop="20px"
          color="#161F36"
        >
          Switch network
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
          color="#676B75"
        >
          The wallet you connected is not on the Optism network, please switch network to continue sign,
        </Box>
        <Button size="xl" type="gradientBlue" width="100%" marginTop="30px" onClick={() => switchChain({ chainId: targetChainId })}>
          Switch to {targetChainName} network
        </Button>
        <Box marginTop="18px" height="42px" borderRadius="22px" padding="10px 12px" background="#F2F3F5" width="fit-content" marginLeft="auto" marginRight="auto">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box marginRight="8px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            {/* <Box fontWeight="500" fontSize="14px" marginRight="4px">Wallet_1</Box> */}
            <Box fontSize="14px">{toShortAddress(address)}</Box>
            <Box width="1px" height="20px" background="#E2E2E2" marginLeft="10px" marginRight="10px"></Box>
            <Box onClick={() => disconnectEOA()}><OpenIcon /></Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (isConnected) {
    return (
      <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose} connectEOA={connectEOA} isConnecting={isConnecting}>
        <Box
          width="144px"
          height="144px"
          marginBottom="16px"
          position="relative"
          margin="0 auto"
        >
          <Image height="144px" src={RecoverSuccessIcon} />
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="28px"
          fontWeight="500"
          color="#161F36"
        >
          Recover request
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="20px"
          color="#676B75"
        >
          Your friend's wallet is lost. As their recovery contact, please connect your wallet and confirm request to assist with their wallet recovery.
        </Box>
        <Box
          width="100%"
          background="#F2F3F5"
          borderRadius="16px"
          padding="24px"
          marginTop="18px"
        >
          <Box
            // color="rgba(0, 0, 0, 0.8)"
            fontSize="18px"
            fontWeight="500"
            display="flex"
            alignItems="center"
            marginBottom="12px"
            color="#161F36"
          >
            <Box>Wallet to recover:</Box>
          </Box>
          <Box
            fontSize="18px"
            fontWeight="400"
          >
            <Box as="span" color={chainConfig.chainColor}>{chainConfig.chainPrefix}</Box>
            <Box as="span" color="black">{recoveryAddress && recoveryAddress.slice(0, 6)}</Box>
            <Box as="span" color="#95979C">{recoveryAddress && recoveryAddress.slice(6, -6)}</Box>
            <Box as="span" color="black">{recoveryAddress && recoveryAddress.slice(-6)}</Box>
          </Box>
          <Box
            borderRadius="4px"
            display="flex"
            width="fit-content"
            padding="4px"
            marginTop="18px"
          >
            <Box marginRight="4px">
              <Image width="20px" height="20px" src={chainConfig.icon} />
            </Box>
            <Box fontWeight="500" fontSize="14px">{chainConfig.chainName}</Box>
          </Box>
        </Box>
        <Button
          size="xl"
          type="gradientBlue"
          width="100%"
          marginTop="30px"
          onClick={sign}
          loading={signing}
          disabled={signing}
        >
          Confirm and Sign
        </Button>
        <Box marginTop="18px" height="42px" borderRadius="22px" padding="10px 12px" background="#F2F3F5" width="fit-content" marginLeft="auto" marginRight="auto">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box marginRight="8px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            {/* <Box fontWeight="500" fontSize="14px" marginRight="4px">Wallet_1</Box> */}
            <Box fontSize="14px">{toShortAddress(address)}</Box>
            <Box width="1px" height="20px" background="#E2E2E2" marginLeft="10px" marginRight="10px"></Box>
            <Box onClick={() => disconnectEOA()}><OpenIcon /></Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  return (
    <SignContainer isOpen={isOpen} onOpen={onOpen} onClose={onClose} connectEOA={connectEOA} isConnecting={isConnecting}>
      <Box
        width="144px"
        height="144px"
        marginBottom="16px"
        position="relative"
        margin="0 auto"
      >
        <Image height="144px" src={RecoverSuccessIcon} />
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="500"
        color="#161F36"
      >
        Recover request
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="20px"
        color="#676B75"
      >
        Your friend's wallet is lost. As their recovery contact, please connect your wallet and confirm request to assist with their wallet recovery.
      </Box>
      <Box
        width="100%"
        background="#F2F3F5"
        borderRadius="16px"
        padding="24px"
        marginTop="18px"
      >
        <Box
          // color="rgba(0, 0, 0, 0.8)"
          fontSize="18px"
          fontWeight="500"
          display="flex"
          alignItems="center"
          marginBottom="12px"
          color="#161F36"
        >
          <Box>Wallet to recover:</Box>
        </Box>
        <Box
          fontSize="18px"
          fontWeight="400"
        >
          <Box as="span" color={chainConfig.chainColor}>{chainConfig.chainPrefix}</Box>
          <Box as="span" color="black">{recoveryAddress && recoveryAddress.slice(0, 6)}</Box>
          <Box as="span" color="#95979C">{recoveryAddress && recoveryAddress.slice(6, -6)}</Box>
          <Box as="span" color="black">{recoveryAddress && recoveryAddress.slice(-6)}</Box>
        </Box>
        <Box
          borderRadius="4px"
          display="flex"
          width="fit-content"
          padding="4px"
          marginTop="18px"
        >
          <Box marginRight="4px">
            <Image width="20px" height="20px" src={chainConfig.icon} />
          </Box>
          <Box fontWeight="500" fontSize="14px">{chainConfig.chainName}</Box>
        </Box>
      </Box>
      <Button size="xl" type="gradientBlue" width="100%" marginTop="30px" onClick={onOpen}>{isConnecting ? 'Connecting' : 'Connect wallet'}</Button>
    </SignContainer>
  );
}
