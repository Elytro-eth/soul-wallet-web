import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Image,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/mobile/Header';
import Button from '@/components/mobile/Button';
import IntroItem1Icon from '@/components/Icons/mobile/Intro/Item1';
import IntroItem2Icon from '@/components/Icons/mobile/Intro/Item2';
import IntroItem3Icon from '@/components/Icons/mobile/Intro/Item3';
import TwitterIcon from '@/components/Icons/desktop/Twitter';
import TelegramIcon from '@/components/Icons/desktop/Telegram';
import GithubIcon from '@/components/Icons/desktop/Github';
import LinkedInIcon from '@/components/Icons/desktop/LinkedIn';
import USDCIcon from '@/assets/tokens/usdc.png';
import IconLoading from '@/assets/mobile/loading.gif';
import Toolbar1 from '@/assets/toolbar1.png';
import Toolbar2 from '@/assets/toolbar2.png';
import AddHomeIMG from '@/assets/add-home.svg';
import config from '@/config';
import useWallet from '@/hooks/useWallet';
import { useBalanceStore } from '@/store/balance';
import treasuryIcon from '@/assets/mobile/treasury.png';
import CoinbaseIcon from '@/assets/mobile/coinbase.png';
import AAVEIcon from '@/assets/mobile/aave.png';
import BN from 'bignumber.js';
import APYCard from '@/components/mobile/APYCard';
import useScreenSize from '@/hooks/useScreenSize';
import { useSettingStore } from '@/store/setting';
import { isPwaMode } from '@/lib/tools';
import ThemePage from '@/components/ThemeChange';
import { useTempStore } from '@/store/temp';
import { useAddressStore } from '@/store/address';

export default function Landing() {
  const [loaded, setLoaded] = useState(false);
  const { loginWallet } = useWallet();
  const { selectedAddress } = useAddressStore();
  const { sevenDayApy } = useBalanceStore();
  const [logging, setLogging] = useState(false);
  const { clearTempInfo } = useTempStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { innerHeight } = useScreenSize();
  const { getShouldShowAddedToHomeScreen, setLastAddedToHomeScreenTime} = useSettingStore();
  const marginHeight = innerHeight - ((innerHeight - 40) < 620 ? (innerHeight - 40) : 620);

  const isPwa = isPwaMode();

  const navigate = useNavigate();
  const doSignIn = async () => {
    try {
      setLogging(true);
      await loginWallet();
      setLogging(false);
      navigate('/dashboard');
    } catch (err) {
      setLogging(false);
    }
  };

  useEffect(() => {
    setLoaded(true);
  }, [loaded]);

  useEffect(() => {
    if (!isPwaMode() && getShouldShowAddedToHomeScreen()) {
      setTimeout(() => {
        onOpen();
      }, 1000);
    }
    return () => {
      onClose();
    };
  }, []);

  const goRecover = () => {
    // clear previous recover info
    clearTempInfo();
    navigate('/recover')
  }

  useEffect(()=>{
    if(selectedAddress){
      // navigate('/dashboard')
    }
  }, [selectedAddress])

  return (
    <ThemePage themeColor="#f9f5f2">
      <Box
        width="100%"
        height={innerHeight}
        background={{
          sm: `radial-gradient(476.97% 147.07% at 0% -21.13%, #FBFBF9 0%, #F7F0ED 45.5%, #BAD5F5 100%)`,
          md: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
        }}
      >
        <Header showLogo={false} title="" height="60px" background="transparent" />
        <Box
          width="100%"
          padding="30px"
          {...isPwa ? {
            paddingBottom: "64px",
          } : {}}
          display="flex"
          alignItems="flex-start"
          flexDirection={{
            sm: 'column',
            md: 'row',
          }}
          height={innerHeight - 60}
          overflowY="auto"
          paddingTop={{
            sm: '0',
            md: '118px',
          }}
        >
          <Box
            width={{
              sm: '100%',
              md: '50%',
            }}
            display="flex"
            alignItems="center"
            flexDirection="column"
            marginTop={{
              sm: 'auto',
              md: '0',
            }}
          >
            <Box
              width={{
                sm: '100%',
                md: '450px',
              }}
              maxWidth="100%"
            >
              <Box
                width="100%"
                fontSize="56px"
                fontWeight="500"
                lineHeight="56px"
                textAlign="left"
                color="#161F36"
              >
                Simplified<br/>
                Ethereum<br/>
                Experience
              </Box>
              <Box
                width="100%"
                fontSize="18px"
                fontWeight="400"
                lineHeight="22.5px"
                marginTop="16px"
                textAlign="left"
                marginBottom="48px"
                color="rgba(0, 0, 0, 0.6)"
              >
                Setup up new account to receive
                10 USDC
              </Box>
              <Box
                width="100%"
                color="#324174"
                fontSize="14px"
                fontWeight="400"
                lineHeight="24px"
                display={{
                  sm: 'none',
                  md: 'block'
                }}
              >
                If you have any questions, reach out to us at <Box as="span" fontWeight="500">support@soulwallet.io</Box>
              </Box>
              <Box
                marginTop="14px"
                alignItems="center"
                justifyContent="flex-start"
                gap="17px"
                display={{
                  sm: 'none',
                  md: 'flex'
                }}
              >
                <Box
                  cursor="pointer"
                >
                  <TwitterIcon />
                </Box>
                <Box
                  cursor="pointer"
                >
                  <TelegramIcon />
                </Box>
                <Box
                  cursor="pointer"
                >
                  <GithubIcon />
                </Box>
                <Box
                  cursor="pointer"
                >
                  <LinkedInIcon />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            width={{
              sm: '100%',
              md: '50%',
            }}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Box
              width={{
                sm: '100%',
                md: '480px',
              }}
              maxWidth="100%"
              display="flex"
              alignItems="center"
              flexDirection="column"
              background={{
                sm: 'transparent',
                md: 'white',
              }}
              borderRadius="32px"
              padding={{
                sm: '0',
                md: '32px'
              }}
            >
              <Box
                color="#161F36"
                fontSize="28px"
                fontWeight="500"
                width="100%"
                display={{
                  sm: 'none',
                  md: 'flex',
                }}
                alignItems="center"
                justifyContent="center"
                marginBottom="20px"
              >
                Get started
              </Box>
              <Box
                bottom="36px"
                width="100%"
                left="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Link to="/create" style={{ width: '100%' }}>
                  <Button
                    size="xl"
                    type="gradientBlue"
                    minWidth="283px"
                    width="100%"
                    border="none"
                    display={{
                      sm: 'none',
                      md: 'flex'
                    }}
                  >
                    Create account
                  </Button>
                  <Button
                    size="xl"
                    type="white"
                    minWidth="283px"
                    width="100%"
                    border="none"
                    display={{
                      sm: 'flex',
                      md: 'none'
                    }}
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
                  type="transparent"
                  width="100%"
                >
                  {logging ? <Image src={IconLoading} width="50px" /> : 'Sign in with passkey'}
                </Button>
              </Box>
              <Box fontSize="14px" fontWeight="400" color="#2D3CBD" lineHeight="17.5px" marginBottom="20px">
                Lost account?{' '}
                <Box as="span" fontWeight="500" onClick={goRecover} cursor="pointer">
                  Recover here
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setLastAddedToHomeScreenTime(new Date().valueOf())
            onClose();
          }}
          motionPreset="slideInBottom"
          blockScrollOnMount={true}
        >
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
            height={(innerHeight - 40) < 620 ? (innerHeight - 40) : 620}
            overflow="visible"
            mb="0"
            position="relative"
            overflowY="scroll"
          >
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              width="100%"
              paddingLeft="0"
              paddingRight="0"
              paddingTop="0px"
              background="radial-gradient(476.97% 147.07% at 0% -21.13%, #FBFBF9 0%, #F7F0ED 45.5%, #BAD5F5 100%)"
            >
              <Box
                height="96px"
                width="96px"
                mb="3"
                ml="8"
                // borderRadius="120px"
                // marginBottom="30px"
                // marginLeft="32px"
                // marginRight="32px"
              >
                <Image src={AddHomeIMG} />
              </Box>
              <Box
                fontSize="30px"
                fontWeight="500"
                lineHeight="1"
                padding="0 32px"
                marginBottom="40px"
                marginTop="5px"
                color="#161F36"
              >
                Add to home screen
              </Box>
              <Box fontSize="16px" paddingBottom="14px" paddingLeft="32px" paddingRight="32px">
                <Box fontSize="28px" fontWeight="500" lineHeight="1">
                  01
                </Box>
                <Box fontSize="20px" lineHeight="22.5px" marginTop="5px" color="#161F36">
                  Tap Share icon at toolbar
                </Box>
              </Box>
              <Box width="100%">
                <Image src={Toolbar1} />
              </Box>
              <Box fontSize="16px" paddingBottom="14px" paddingLeft="32px" paddingRight="32px" marginTop="24px">
                <Box fontSize="28px" fontWeight="500" lineHeight="1">
                  02
                </Box>
                <Box fontSize="20px" lineHeight="22.5px" marginTop="5px" color="#161F36">
                  Tap “Add to Homescreen”
                </Box>
              </Box>
              <Box width="100%">
                <Image src={Toolbar2} />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ThemePage>
  );
}
