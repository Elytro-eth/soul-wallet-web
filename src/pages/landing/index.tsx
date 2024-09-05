import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Image,
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
import IconLoading from '@/assets/mobile/loading.gif';
import Toolbar1 from '@/assets/toolbar1.png';
import Toolbar2 from '@/assets/toolbar2.png';
import AddHomeIMG from '@/assets/add-home.svg';
import config from '@/config';
import useWallet from '@/hooks/useWallet';
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
  const [logging, setLogging] = useState(false);
  const { clearTempInfo } = useTempStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { innerHeight } = useScreenSize();
  const { getShouldShowAddedToHomeScreen, setLastAddedToHomeScreenTime } = useSettingStore();
  const marginHeight = innerHeight - ((innerHeight - 40) < 620 ? (innerHeight - 40) : 620);

  const isPwa = isPwaMode();

  const navigate = useNavigate();
  const doSignIn = async () => {
    try {
      setLogging(true);
      await loginWallet();
      setLogging(false);
      navigate('/dashboard/assets');
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

  useEffect(() => {
    if (selectedAddress) {
      navigate('/dashboard/assets')
    }
  }, [selectedAddress])

  const modalHeight = (innerHeight - 40) < 620 ? (innerHeight - 40) : 620

  return (
    <ThemePage themeColor="#f9f5f2">
      <Box
        width="100%"
        height={innerHeight}
        background={{
          base: `radial-gradient(476.97% 147.07% at 0% -21.13%, #FBFBF9 0%, #F7F0ED 45.5%, #BAD5F5 100%)`,
          lg: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
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
            base: 'column',
            lg: 'row',
          }}
          height={innerHeight - 60}
          overflowY="auto"
          paddingTop={{
            base: '0',
            lg: '118px',
          }}
        >
          <Box
            width={{
              base: '100%',
              lg: '50%',
            }}
            display="flex"
            alignItems="center"
            flexDirection="column"
            marginTop={{
              base: 'auto',
              lg: '0',
            }}
          >
            <Box
              width={{
                base: '100%',
                lg: '450px',
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
                Simplified<br />
                Ethereum<br />
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
                Setup up new account to receive 10 USDC
              </Box>
              <Box
                width="100%"
                color="#324174"
                fontSize="14px"
                fontWeight="400"
                lineHeight="24px"
                display={{
                  base: 'none',
                  lg: 'block'
                }}
              >
                If you have any questions, reach out to us at <Box as="strong" fontWeight="500">support@soulwallet.io</Box>
              </Box>
              <Box
                marginTop="14px"
                alignItems="center"
                justifyContent="flex-start"
                gap="17px"
                display={{
                  base: 'none',
                  lg: 'flex'
                }}
              >
                {config.socials.map((item, idx) => (
                  <a href={item.link} target='_blank' key={idx}
                  >
                    <Image src={item.icon} />
                  </a>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            width={{
              base: '100%',
              lg: '50%',
            }}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Box
              width={{
                base: '100%',
                lg: '480px',
              }}
              maxWidth="100%"
              display="flex"
              alignItems="center"
              flexDirection="column"
              background={{
                base: 'transparent',
                lg: 'white',
              }}
              borderRadius="32px"
              padding={{
                base: '0',
                lg: '32px'
              }}
            >
              <Box
                color="#161F36"
                fontSize="28px"
                fontWeight="500"
                width="100%"
                display={{
                  base: 'none',
                  lg: 'flex',
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
                      base: 'none',
                      lg: 'flex'
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
                      base: 'flex',
                      lg: 'none'
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
              base: '32px 32px 0 0',
              lg: '32px',
            }}
            maxW={{
              base: '100vw',
              lg: '430px',
            }}
            marginTop={{
              base: `${marginHeight}px`,
              lg: `calc(50vh - ${modalHeight / 2}px)`,
            }}
            height={modalHeight}
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
