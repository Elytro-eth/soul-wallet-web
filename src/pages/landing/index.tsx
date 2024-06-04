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
        padding="30px 0"
        display="flex"
        alignItems="center"
        flexDirection="column"
        height={innerHeight - 60}
        overflowY="auto"
      >
        <Box  fontSize="48px" fontWeight="700" textAlign="center" lineHeight="56px">
          Democratize access to<br /> Ethereum<br /> for All
        </Box>
        <Box  fontSize="16px" fontWeight="500" textAlign="center" marginTop="16px">
          Your first crypto is on us.<br />
          Oh, and <Box as="span" fontWeight="700">no gas fees.</Box><br />
          We even have <Box as="span" fontWeight="700">24/7</Box> support to help!
        </Box>
        <Box marginTop="60px">
          <Image src={IntroIMG} />
        </Box>
        <Box
          ref={observingElementRef}
          bottom="36px"
          width="100%"
          left="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="0 25px"
        >
          <Link to="/create" style={{ width: '100%' }}>
            <Button
              size="xl"
              type="black"
              minWidth="283px"
              marginTop="50px"
              width="100%"
            >
              Create account
            </Button>
          </Link>
        </Box>
        {/* <Box
            position="fixed"
            bottom="36px"
            width="100%"
            left="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            opacity={isButtonVisible ? 0 : 1}
            pointerEvents={isButtonVisible ? 'none' : 'all'}
            transition="all 0.2s ease"
            >
            <Link to="/create">
            <Button
            boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.20)"
            size="xl"
            type="black"
            minWidth="283px"
            marginTop="50px"
            >
            Create account
            </Button>
            </Link>
            </Box> */}
        <Box width="100%" padding="0 25px">
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
        <Box fontSize="14px" fontWeight="400" marginTop="auto">
          Lost access to account? <Box as="span" fontWeight="600">Recover here</Box>
        </Box>
        {/* <APYCard /> */}
        {/* <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
            <Box
            fontSize="24px"
            fontWeight="700"
            >
            Onchain
            </Box>
            <Box
            fontSize="18px"
            fontWeight="400"
            padding="4px 10px"
            >
            vs
            </Box>
            <Box
            fontSize="24px"
            fontWeight="700"
            >
            CEX
            </Box>
            </Box>
            <Box
            width="100%"
            background="white"
            borderRadius="24px"
            boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
            border="1px solid #EAECF0"
            >
            <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
            <IntroItem1Icon />
            </Box>
            <Box>
            <Box fontSize="18px" fontWeight="700">
            Higher APY rate
            </Box>
            <Box fontSize="14px" fontWeight="400">
            For USDC, onchain earn has a upto {sevenDayApy}% APY, which is higher than most CEX.
            </Box>
            </Box>
            </Box>

            <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
            <IntroItem2Icon />
            </Box>
            <Box>
            <Box fontSize="18px" fontWeight="700">
            Your key, your return
            </Box>
            <Box fontSize="14px" fontWeight="400">
            Self custody wallet with fully decentralized service.
            </Box>
            </Box>
            </Box>

            <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
            <IntroItem3Icon />
            </Box>
            <Box>
            <Box fontSize="18px" fontWeight="700">
            Simple and free
            </Box>
            <Box fontSize="14px" fontWeight="400">
            Instant deposit and redeem. No management fees.
            </Box>
            </Box>
            </Box>
            </Box>
            <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
            <Box
            fontSize="24px"
            fontWeight="700"
            >
            How Stable.cash earns
            </Box>
            </Box>
            <Box
            width="100%"
            background="white"
            borderRadius="24px"
            boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
            border="1px solid #EAECF0"
            >
            <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box>
            <Box fontSize="18px" fontWeight="700">
            Earn supply interest on AAVE
            </Box>
            <Box fontSize="14px" fontWeight="400">
            Each asset has its own market of supply and demand with its own APY (Annual Percentage Yield) which evolves with time. You can find the average annual rate over the past 30 days to evaluate the rate evolution, and you can also find more data on the reserve overview of each asset in the home section on the app.
            </Box>
            </Box>
            </Box>

            <Box display="flex" padding="24px">
            <Box>
            <Box fontSize="18px" fontWeight="700">
            Earn the most with Auto-saving
            </Box>
            <Box fontSize="14px" fontWeight="400">
            Stable.cash empowers each account for a customized risk free feature, auto-saving. Each deposit to the Stable.cash account will be auto saved into AAVE protocol to earn interest. You can withdraw anytime with a flexible term for your assets. Let auto-saving makes the most of your earnings.
            </Box>
            </Box>
            </Box>
            </Box>
            <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
            <Box
            fontSize="24px"
            fontWeight="700"
            >
            About OP Mainnet
            </Box>
            </Box>

            <Box
            width="100%"
            background="white"
            borderRadius="24px"
            boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
            border="1px solid #EAECF0"
            >
            <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="100%">
            <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            marginBottom="14px"
            >
            <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            >
            <Box

            fontWeight="700"
            fontSize="18px"
            textAlign="center"
            >
            $8.317b
            </Box>
            <Box

            fontWeight="400"
            fontSize="12px"
            marginTop="5px"
            textAlign="center"
            >
            TVL
            </Box>
            </Box>
            <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            >
            <Box

            fontWeight="700"
            fontSize="18px"
            textAlign="center"
            >
            2th
            </Box>
            <Box

            fontWeight="400"
            fontSize="12px"
            marginTop="5px"
            textAlign="center"
            >
            Ranking
            </Box>
            </Box>
            <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            >
            <Box

            fontWeight="700"
            fontSize="18px"
            textAlign="center"
            >
            21.28%
            </Box>
            <Box

            fontWeight="400"
            fontSize="12px"
            marginTop="5px"
            textAlign="center"
            >
            L2 Market share
            </Box>
            </Box>
            </Box>
            <Box fontSize="14px" fontWeight="400">
            OP Mainnet is an EVM-equivalent Optimistic Rollup. It aims to be fast, simple, and secure.
            </Box>
            </Box>
            </Box>
            </Box> */}
        {/* <Box marginTop="40px" textAlign="center">
            <Box color="#7a787e">Version: Alpha 0.0.1</Box>
            <Flex gap="4" justify="center" align="center" mt="10px">
            {config.socials.map((item, idx) => (
            <a
            href={item.link}
            target="_blank"
            key={idx}
            >
            <Image w="6" h="6" src={item.icon} className="icon" />
            <Image w="6" h="6" src={item.iconActivated} display="none" className="icon-activated" />
            </a>
            ))}
            </Flex>
            </Box> */}
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
        overflow="visible"
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          overflow="visible"
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
