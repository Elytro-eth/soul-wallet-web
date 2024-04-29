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
import { useTempStore } from '@/store/temp';
import { useSettingStore } from '@/store/setting';
import SetPasskey from './SetPasskey';
import SetGuardian from './SetGuardian';
import SelectNetwork from './SelectNetwork';
import { SignHeader } from '../public/Sign';
import useWallet from '@/hooks/useWallet';
import useTools from '@/hooks/useTools';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [stepType, setStepType] = useState('auth');
  const [walletName, setWalletName] = useState('');
  const [credentials, setCredentials] = useState([]);
  const { loginInfo } = useTempStore();
  const { getSignerIdAddress } = useSettingStore();
  const { initWallet, loginWallet, } = useWallet();
  const { clearLogData } = useTools();
  const { navigate } = useBrowser();
  const signerIdAddress = getSignerIdAddress();
  const activeSignerId = loginInfo.signerId;
  const activeLoginAccounts = signerIdAddress[loginInfo.signerId];
  console.log('signerIdAddress', activeSignerId, activeLoginAccounts, signerIdAddress, stepType);

  const openRecover = useCallback(() => {
    navigate('/recover');
  }, []);

  const startCreate = () => {
    setStepType('selectNetwork')
  }

  const onCreate = async(initialGuardianHash:string) => {
    const res = await initWallet(credentials, initialGuardianHash, walletName);
    console.log('res is', res)
    navigate('/dashboard')
  }

  const doLogin = async () => {
    try{
      setLoading(true);
      await loginWallet();
      navigate('/dashboard')
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    clearLogData();
  }, [])

  if (stepType === 'selectNetwork') {
    return <SelectNetwork walletName={walletName} setWalletName={setWalletName} onNext={()=> setStepType('setPassKey')} back={() => setStepType('auth')} />;
  }

  if (stepType === 'setPassKey') {
    return <SetPasskey walletName={walletName} credentials={credentials} setCredentials={setCredentials} back={() => setStepType('selectNetwork')} next={() => setStepType('setGuardian')} />;
  }

  if (stepType === 'setGuardian') {
    return <SetGuardian walletName={walletName} back={() => setStepType('setPassKey')} onCreate={onCreate} />;
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
        mt={{base: 8, lg: 0}}
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
          <Box width={{ base: '100%', md: '50%' }} background="#F8F8F8" flex="1" display="flex" py={{ base: "32px", lg: "60px"}}>
            <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Box width="348px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={{ base: '0 20px', md: '0' }}>
                <Box marginBottom="12px" width="100%">
                  <Input
                    height="52px"
                    type="text"
                    width="100%"
                    background="white"
                    placeholder="Enter wallet name"
                    value={walletName}
                    autoComplete='webauthn'
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
                <Button width="100%" type="white" loading={loading} marginBottom="24px" onClick={doLogin} size="xl">
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
      </Box>
    </Flex>
  );
}
