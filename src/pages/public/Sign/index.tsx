import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, PopoverTrigger, Link } from '@chakra-ui/react';
import IconLogo from '@/assets/logo-all-v3.svg';
import RoundContainer from '@/components/new/RoundContainer';
import Button from '@/components/Button';
import { useSignTypedData, useSwitchChain } from 'wagmi';
import { SocialRecovery } from '@soulwallet/sdk';
import api from '@/lib/api';
import useConfig from '@/hooks/useConfig';
import SignatureRequestImg from '@/assets/icons/signature-request.svg';
import { useParams } from 'react-router-dom';
import WarningIcon from '@/components/Icons/Warning';
import SuccessIcon from '@/components/Icons/Success';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import ConnectWalletModal from '@/pages/recover/ConnectWalletModal';
import useWagmi from '@/hooks/useWagmi';
import IconOp from '@/assets/chains/op.svg';

const validateSigner = (recoveryRecord: any, address: any) => {
  if (!recoveryRecord) return;
  const guardians = recoveryRecord.guardian_info.guardians;
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

export default function Sign() {
  const { recoverId } = useParams();
  const [recoveryRecord, setRecoveryRecord] = useState<any>();
  const [signing, setSigning] = useState(false);
  const { chainConfig } = useConfig();
  const [loaded, setLoaded] = useState(false);
  const [isSigned, setIsSigned] = useState<any>(false);
  const toast = useToast();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChain } = useSwitchChain();
  const ethersSigner = useEthersSigner();
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

  const loadRecord = async (recoverId: any) => {
    try {
      const res = await api.guardian.getRecoverRecord({ recoveryID: recoverId });
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

      const typedDataToSign = SocialRecovery.getSocialRecoveryTypedData(
        recoveryRecord.chain_id,
        chainConfig.contracts.socialRecoveryModule,
        recoveryRecord.address,
        recoveryRecord.nonce,
        recoveryRecord.new_owners,
      )

      // const signature = await signTypedDataAsync({
      //   domain: typedDataToSign.domain,
      //   types: typedDataToSign.types,
      //   message: typedDataToSign.message,
      // } as any);
      const signer:any = await ethersSigner;

      const signature = await signer.signTypedData(typedDataToSign.domain, typedDataToSign.types, typedDataToSign.message);

      // SocialRecovery.packGuardianSignature(signature);
      const res: any = await api.guardian.guardianSign({
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

  const targetChainId = parseInt(recoveryRecord?.chain_id);

  if (!loaded) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            minHeight="544px"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            flexDirection={{ base: 'column', md: 'row' }}
            background="#FFFFFF"
          >
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
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    Loading...
                  </Box>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Flex>
    );
  }

  if (!!isSigned) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          marginTop="60px"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            minHeight="544px"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            flexDirection={{ base: 'column', md: 'row' }}
            background="#FFFFFF"
          >
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
                  <Box
                    marginBottom="22px"
                    width="120px"
                    height="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SuccessIcon size="120" />
                  </Box>
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    Thank you, signature received!
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    fontFamily="Nunito"
                    lineHeight={'normal'}
                    color="black"
                    marginTop="34px"
                    maxWidth="500px"
                  >
                    Recover for: {recoveryRecord.address}
                  </Box>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Flex>
    );
  }

  if (!!isConnected && !isValidSigner) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          paddingTop="60px"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            minHeight="544px"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            flexDirection={{ base: 'column', md: 'row' }}
            background="#FFFFFF"
          >
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
                  <Box
                    marginBottom="22px"
                    width="120px"
                    height="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <WarningIcon size="80" />
                  </Box>
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    You’re not the guardian
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    fontFamily="Nunito"
                    lineHeight={'normal'}
                    color="black"
                    marginTop="34px"
                  >
                    The wallet you connected is not the guardian for the recovery wallet. Please double check.
                  </Box>
                </Box>
                <Box
                  width="320px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="30px"
                >
                  <Button width="100%" type="black" color="white" marginBottom="18px" onClick={openConnect} size="xl">
                    Connect another wallet
                  </Button>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
        <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} />
      </Flex>
    );
  }

  if (!!isConnected && connectedChainId !== targetChainId) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          paddingTop="60px"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            minHeight="544px"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            flexDirection={{ base: 'column', md: 'row' }}
            background="#FFFFFF"
          >
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
                  <Box
                    marginBottom="22px"
                    width="120px"
                    height="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <WarningIcon size="80" />
                  </Box>
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    The network doesn’t match
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    fontFamily="Nunito"
                    lineHeight={'normal'}
                    color="black"
                    marginTop="34px"
                  >
                    {`The wallet you connected is not on the {${targetChainName}} network, please switch network to continue sign`}
                  </Box>
                </Box>
                <Box
                  width="360px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="30px"
                >
                  <Button
                    width="100%"
                    type="black"
                    color="white"
                    marginBottom="18px"
                    onClick={() => switchChain({ chainId: targetChainId })}
                    size="xl"
                  >
                    {`Switch to {${targetChainName}} network`}
                  </Button>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
        <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} />
      </Flex>
    );
  }

  if (isConnected && false) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          paddingTop="60px"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            minHeight="544px"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            flexDirection={{ base: 'column', md: 'row' }}
            background="#FFFFFF"
          >
            <Box width={{ base: '100%', md: '100%' }} flex="1" display="flex" padding="60px">
              <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box
                  maxWidth={{ base: '100%', md: '548px' }}
                  textAlign="center"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box marginBottom="22px" width="120px" height="120px">
                    <Image src={SignatureRequestImg} width="120px" height="120px" />
                  </Box>
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    Signature request
                  </Box>
                  {address && (
                    <Box
                      fontSize="14px"
                      fontWeight="500"
                      fontFamily="Nunito"
                      color="rgba(0, 0, 0, 0.80)"
                      wordBreak="break-all"
                    >
                      From: {address}
                    </Box>
                  )}
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    fontFamily="Nunito"
                    color="black"
                    marginTop="34px"
                    lineHeight={'normal'}
                    wordBreak="break-all"
                  >
                    Your friend's wallet is lost. As their guardian, please connect your wallet and confirm request to
                    assist with their wallet recovery.
                  </Box>
                  <Box
                    marginTop="27px"
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems="center"
                    width="max-content"
                  >
                    <Box
                      background="#F3F3F3"
                      padding="4px 8px"
                      borderRadius="4px"
                      fontSize="14px"
                      fontWeight="500"
                      marginRight={{ base: '0', md: '8px' }}
                      whiteSpace="pre"
                      display="flex"
                      alignItems="center"
                      marginBottom={{ base: '10px', md: '0' }}
                      flexDirection={{ base: 'column', md: 'row' }}
                      minHeight="32px"
                    >
                      <Box as="span" fontWeight="700">Recovery wallet:</Box>
                      <Box as="span">{recoveryAddress}</Box>
                    </Box>
                    <Box
                      background="#F3F3F3"
                      padding="4px 8px"
                      borderRadius="4px"
                      display="flex"
                      alignItems="center"
                      width="max-content"
                    >
                      <Image src={IconOp} w="24px" h="24px" />
                      <Box marginLeft="4px">
                        <Box fontWeight="500" fontSize="12px" whiteSpace="pre">
                          {targetChainName}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  width="320px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="30px"
                >
                  <Button
                    width="100%"
                    type="black"
                    color="white"
                    marginBottom="18px"
                    onClick={sign}
                    loading={signing}
                    disabled={signing}
                    size="xl"
                  >
                    Confirm and Sign
                  </Button>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
        <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} />
      </Flex>
    );
  }

  return (
    <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 58px)"
        flexDirection="column"
        width="100%"
        paddingTop="60px"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          minHeight="544px"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          flexDirection={{ base: 'column', md: 'row' }}
          background="#FFFFFF"
        >
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
                <Box marginBottom="22px" width="120px" height="120px">
                  <Image src={SignatureRequestImg} width="120px" height="120px" />
                </Box>
                <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                  Recovery request
                </Box>
                {address && (
                  <Box
                    fontSize="14px"
                    fontWeight="500"
                    fontFamily="Nunito"
                    color="rgba(0, 0, 0, 0.80)"
                    wordBreak="break-all"
                  >
                    From: {address}
                  </Box>
                )}
                <Box
                  fontSize="14px"
                  fontWeight="400"
                  fontFamily="Nunito"
                  color="black"
                  marginTop="34px"
                  lineHeight={'normal'}
                  wordBreak="break-all"
                >
                  Your friend's wallet is lost. As their guardian, please connect your wallet and confirm request to
                  assist with their wallet recovery.
                </Box>
                <Box
                  marginTop="27px"
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  alignItems="center"
                  width="max-content"
                >
                  <Box
                    background="#F3F3F3"
                    padding="4px 8px"
                    borderRadius="4px"
                    fontSize="14px"
                    fontWeight="500"
                    marginRight={{ base: '0', md: '8px' }}
                    whiteSpace="pre"
                    display="flex"
                    alignItems="center"
                    marginBottom={{ base: '10px', md: '0' }}
                    flexDirection={{ base: 'column', md: 'row' }}
                    minHeight="32px"
                  >
                    <Box as="span" fontWeight="700">Requestor:</Box> {recoveryAddress}
                  </Box>
                  <Box
                    background="#F3F3F3"
                    padding="4px 8px"
                    borderRadius="4px"
                    display="flex"
                    alignItems="center"
                    width="max-content"
                  >
                    <Image src={IconOp} w="24px" h="24px" />
                    <Box marginLeft="4px">
                      <Box fontWeight="500" fontSize="12px" whiteSpace="pre">
                        {targetChainName}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                width="320px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginTop="30px"
              >
                <Button
                  width="100%"
                  type="black"
                  color="white"
                  marginBottom="18px"
                  onClick={openConnect}
                  disabled={isConnecting}
                  size="xl"
                >
                  {isConnecting ? 'Connecting' : 'Connect wallet'}
                </Button>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
      <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} />
    </Flex>
  );
}
