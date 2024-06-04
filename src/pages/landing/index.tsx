import { useState, useEffect, useRef } from 'react'
import { Box, Image, Flex, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import IntroItem1Icon from '@/components/Icons/mobile/Intro/Item1'
import IntroItem2Icon from '@/components/Icons/mobile/Intro/Item2'
import IntroItem3Icon from '@/components/Icons/mobile/Intro/Item3'
import USDCIcon from '@/assets/tokens/usdc.png'
import IconLoading from '@/assets/mobile/loading.gif';
import IntroIMG from '@/assets/landing-intro.png';
import Toolbar1 from '@/assets/toolbar1.png';
import Toolbar2 from '@/assets/toolbar2.png';
import AddHomeIMG from '@/assets/add-home.svg';
import config from '@/config';
import useWallet from '@/hooks/useWallet';
import { useBalanceStore } from '@/store/balance';
import treasuryIcon from '@/assets/mobile/treasury.png'
import CoinbaseIcon from '@/assets/mobile/coinbase.png'
import AAVEIcon from '@/assets/mobile/aave.png'
import BN from 'bignumber.js'
import APYCard from '@/components/mobile/APYCard'

export default function Landing() {
  const [loaded, setLoaded] = useState(false);
  const { loginWallet  } = useWallet();
  const { sevenDayApy } = useBalanceStore();
  const [logging, setLogging] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 740

  const navigate = useNavigate();
  const doSignIn = async () => {
    try{
      setLogging(true)
      await loginWallet();
      setLogging(false);
      navigate('/dashboard');
    }catch(err){
      setLogging(false);
    }

  }

  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const observingElementRef = useRef(null);

  const baseHeight = 59;
  const aaveHeight = BN(sevenDayApy).div(5).times(baseHeight).toNumber();

  useEffect(() => {
    setLoaded(true)
  }, [loaded])

  useEffect(() => {
    onOpen()

    return () => {
      onClose()
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIsButtonVisible(entry.isIntersecting);
      },
      {
        root: null, // observing changes to visibility in the viewport
        rootMargin: '0px',
        threshold: 0.1, // Trigger if at least 10% of the element is visible
      }
    );

    if (observingElementRef.current) {
      observer.observe(observingElementRef.current);
    }

    return () => {
      if (observingElementRef.current) {
        observer.unobserve(observingElementRef.current);
      }
    };
  }, []);

  return (
    <Box
      width="100%"
      height={innerHeight}
      fontFamily={"SF"}
      // background="linear-gradient(180deg, #FBFBFB 0%, #F0F0F0 100%)"
    >
      <Header
        showLogo={true}
        title=""
        height="60px"
        background="transparent"
      />
      <Box
        width="100%"
        padding="30px"
        display="flex"
        alignItems="center"
        flexDirection="column"
        height={innerHeight - 60}
        overflowY="auto"
      >
        <Box width="100%" fontSize="48px" fontWeight="700" lineHeight="56px" textAlign="left" marginTop="60px">
          Democratize access to<br /> Ethereum<br /> for All
        </Box>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          width="100%"
          marginTop="36px"
          marginBottom="36px"
        >
          <Box
            height="6px"
            width="48px"
            background="#7386C7"
            borderRadius="6px"
          />
        </Box>
        <Box width="100%" fontSize="16px" fontWeight="500" marginTop="16px" textAlign="left">
          Your first crypto is on us.<br />
          Oh, and no gas fees.<br />
          We even have 24/7 support to help!
        </Box>
        <Box
          ref={observingElementRef}
          bottom="36px"
          width="100%"
          left="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop="93px"
        >
          <Link to="/create" style={{ width: '100%' }}>
            <Button
              size="xl"
              type="blue"
              minWidth="283px"
              marginTop="50px"
              width="100%"
            >
              Create account
            </Button>
          </Link>
        </Box>
        <Box width="100%">
          <Button
            size="xl"
            minWidth="283px"
            minHeight="48px"
            marginTop="18px"
            color="black"
            marginBottom="20px"
            onClick={doSignIn}
            type="white"
            width="100%"
          >
            {logging ? <Image src={IconLoading} width="50px" /> : 'Sign in with passkey'}
          </Button>
        </Box>
        <Box fontSize="14px" fontWeight="400" color="#324174">
          Lost access to account? <Box as="span" fontWeight="600">Recover here</Box>
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
          height="740px"
          overflow="visible"
          mb="0"
          position="relative"
        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            paddingLeft="0"
            paddingRight="0"
            paddingTop="20px"
          >
            <Box
              background="#D9D9D9"
              height="120px"
              width="120px"
              borderRadius="120px"
              marginBottom="30px"
            >
              <Image src={AddHomeIMG} />
            </Box>
            <Box fontSize="24px" fontWeight="700" marginBottom="14px" textAlign="center" letterSpacing="-2px">
              Add to home screen to continue...
            </Box>
            <Box width="100%">
              <Image src={Toolbar1} />
            </Box>
            <Box fontWeight="700" fontSize="16px" paddingBottom="14px">1. Click this at toolbar</Box>
            <Box width="100%">
              <Image src={Toolbar2} />
            </Box>
            <Box fontWeight="700" fontSize="16px" paddingBottom="14px">{`2. Click "Add to Home Screen"`}</Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
