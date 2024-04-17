import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, Link, PopoverTrigger, Input } from '@chakra-ui/react';
import config from '@/config';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
import PasskeyIcon from '@/components/Icons/Intro/Passkey';
import AccountIcon from '@/components/Icons/Intro/Account';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useTempStore } from '@/store/temp';
import { useSettingStore } from '@/store/setting';
import usePassKey from '@/hooks/usePasskey';
import SetPasskey from './SetPasskey';
import SetGuardian from './SetGuardian';
import SelectNetwork from './SelectNetwork';
import RegisterModal from './RegisterModal';
import SelectAccountModal from './SelectAccountModal';
import ImportAccountModal from './ImportAccountModal';
import { SignHeader } from '../public/Sign';
import useTools from '@/hooks/useTools';
import useWallet from '@/hooks/useWallet';

export default function Auth() {
  const [stepType, setStepType] = useState('auth');
  const { clearLogData } = useTools();
  const [walletName, setWalletName] = useState('');
  const [credentials, setCredentials] = useState([]);
  const [isConnectAtive, setIsConnectAtive] = useState(false);
  const [activeConnector, setActiveConnector] = useState();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSelectAccountOpen, setIsSelectAccountOpen] = useState(false);
  const [isImportAccountOpen, setIsImportAccountOpen] = useState(false);
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { updateCreateInfo, loginInfo } = useTempStore();
  const account = useAccount();
  const { address, isConnected, isConnecting } = account;
  const { getSignerIdAddress } = useSettingStore();
  const [isImporting, setIsImporting] = useState(false);
  const { initWallet, loginWallet, } = useWallet();
  const { navigate } = useBrowser();
  const signerIdAddress = getSignerIdAddress();
  const activeSignerId = loginInfo.signerId;
  const activeLoginAccounts = signerIdAddress[loginInfo.signerId];
  console.log('signerIdAddress', activeSignerId, activeLoginAccounts, signerIdAddress, stepType);

  const openRecover = useCallback(() => {
    navigate('/recover');
  }, []);

  const closeRegister = useCallback(() => {
    setIsRegisterOpen(false);
  }, []);

  const openSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(true);
  }, []);

  const closeSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(false);
  }, []);

  const closeImportAccount = useCallback(() => {
    setIsImportAccountOpen(false);
  }, []);

  const startLogin = useCallback(() => {
    setIsSelectAccountOpen(true);
  }, []);

  const connectEOA = useCallback(
    async (connector: any) => {
      setIsConnectAtive(true);
      if (address) {
        await disconnectAsync();
      }
      await connectAsync({ connector });
      setActiveConnector(connector);
    },
    [address],
  );

  const startRegisterWithPasskey = useCallback(() => {
    setIsConnectAtive(true);
    closeRegister();
    setStepType('selectNetwork');
  }, []);

  const disconnectEOA = useCallback(async () => {
    if(!isConnected){
      await disconnectAsync();
    }
    setIsConnectAtive(false);
    updateCreateInfo({
      eoaAddress: [],
    });
    // closeRegister()
  }, [isConnected]);

  const startImportAccount = useCallback(() => {
    setIsSelectAccountOpen(false);
    setIsImportAccountOpen(true);
  }, []);

  const startCreate = () => {
    setStepType('selectNetwork')
  }

  const doCreate = async() => {
    const res = await initWallet(credentials, walletName, '');


    
  }

  const doLogin = async () => {
    const res = await loginWallet();
  }

  useEffect(() => {
    // clear log data everytime visited
    clearLogData();
  }, []);

  if (stepType === 'selectNetwork') {
    return <SelectNetwork walletName={walletName} setWalletName={setWalletName} onNext={()=> setStepType('setPassKey')} back={() => setStepType('auth')} />;
  }

  if (stepType === 'setPassKey') {
    return <SetPasskey walletName={walletName} credentials={credentials} setCredentials={setCredentials} back={() => setStepType('selectNetwork')} next={() => setStepType('setGuardian')} />;
  }

  if (stepType === 'setGuardian') {
    return <SetGuardian walletName={walletName} back={() => setStepType('setPassKey')} onCreate={doCreate} />;
  }

  return (
    <Flex width="100%" align={'center'} justify={'center'} minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        paddingTop="60px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={{ base: 'auto', md: 'calc(100vh - 58px)' }}
        flexDirection="column"
        width="100%"
      >
        <RoundContainer
          minHeight="544px"
          display="flex"
          padding="0"
          overflow="hidden"
          flexDirection={{ base: 'column', md: 'row' }}
          background="#FFFFFF"
        >
          <Box
            width={{ base: '100%', md: '50%' }}
            height="100%"
            p={{ base: '32px', lg: '60px' }}
            pt={{ base: '40px', lg: '100px' }}
          >
            <Heading marginBottom={{ base: '24px', lg: '40px' }} fontSize={{ base: '28px', md: '32px', lg: '40px' }}>
              Social recovery wallet for Ethereum
            </Heading>
            <Box marginBottom={{ base: '50px', lg: '90px' }}>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px">
                  <PasskeyIcon />
                </Box>
                <Box>
                  <TextBody>Self-custody with passkey</TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px">
                  <AccountIcon />
                </Box>
                <Box>
                  <TextBody>Recover wallet through trusted friends</TextBody>
                </Box>
              </Box>
            </Box>
            <TextBody fontWeight="700" color="#818181">
              For more info, check out{' '}
              <Box
                as="a"
                target="_blank"
                href={`${import.meta.env.VITE_OFFICIAL_WEB_URL}#faq`}
                color="#FF2E79"
              >{`FAQs >`}</Box>
            </TextBody>
          </Box>
          <Box width={{ base: '100%', md: '50%' }} background="#F8F8F8" flex="1" display="flex" padding="60px">
            <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Box width="348px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box marginBottom="12px" width="100%">
                  <Input
                    height="52px"
                    type="text"
                    width="100%"
                    background="white"
                    placeholder="Enter wallet name"
                    value={walletName}
                    onChange={e => setWalletName(e.target.value)}
                  />
                </Box>
                <Button width="100%" type="black" color="white" marginBottom="18px" size="xl" onClick={startCreate}>
                  Create wallet for free
                </Button>
                <Box
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  margin="0 auto"
                  marginBottom="18px"
                >
                  <Box
                    width="100%"
                    height="1px"
                    background="rgba(0, 0, 0, 0.1)"
                    position="absolute"
                  />
                  <TextBody
                    fontSize="14px"
                    fontWeight="normal"
                    width="40px"
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex="1"
                    background="#F8F8F8"
                    color="rgba(0, 0, 0, 0.6)"
                  >
                    or
                  </TextBody>
                </Box>
                <Button width="100%" type="white" marginBottom="24px" onClick={doLogin} size="xl">
                  Login with passkey
                </Button>
                <TextBody onClick={openRecover} cursor="pointer">
                  Lost access to my account?
                </TextBody>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
        <Box marginTop="40px" textAlign="center">
          <TextBody fontWeight="600" color="#818181" fontSize="16px">
            If you have any questions, reach out to us at{' '}
            <Box as="a" href="mailto:support@soulwallet.io" color="#2D5AF6" textDecoration="underline">
              support@soulwallet.io
            </Box>
          </TextBody>

          <Flex gap="4" justify={'center'} align={'center'} mt="10px">
            {config.socials.map((item, idx) => (
              <Link
                href={item.link}
                target="_blank"
                key={idx}
                _hover={{
                  '> .icon': {
                    display: 'none',
                  },
                  '> .icon-activated': {
                    display: 'block',
                  },
                }}
              >
                <Image w="6" h="6" src={item.icon} className="icon" />
                <Image w="6" h="6" src={item.iconActivated} display={'none'} className="icon-activated" />
              </Link>
            ))}
          </Flex>
        </Box>
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={closeRegister}
          connectEOA={connectEOA}
          isConnecting={isConnecting}
          isConnected={isConnected}
          isConnectAtive={isConnectAtive}
          startRegisterWithPasskey={startRegisterWithPasskey}
          disconnectEOA={disconnectEOA}
          activeConnector={activeConnector}
          address={address}
        />
        <SelectAccountModal
          isOpen={isSelectAccountOpen}
          onClose={closeSelectAccount}
          startImportAccount={startImportAccount}
          activeLoginAccounts={activeLoginAccounts}
          isImporting={isImporting}
        />
        <ImportAccountModal
          isOpen={isImportAccountOpen}
          onClose={closeImportAccount}
          openSelectAccount={openSelectAccount}
          isImporting={isImporting}
        />
      </Box>
    </Flex>
  );
}
