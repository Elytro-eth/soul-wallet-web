import { useState, useEffect, useRef } from 'react'
import { Box, Image, Flex, Modal, ModalBody, ModalContent, ModalOverlay, ModalCloseButton, Link as CLink } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import IntroItem1Icon from '@/components/Icons/mobile/Intro/Item1'
import IntroItem2Icon from '@/components/Icons/mobile/Intro/Item2'
import IntroItem3Icon from '@/components/Icons/mobile/Intro/Item3'
import IconQuestion from '@/assets/icons/apy-question.svg';
import USDCIcon from '@/assets/tokens/usdc.png'
import IconLoading from '@/assets/mobile/loading.gif';
import config from '@/config';
import useWallet from '@/hooks/useWallet';
import { useBalanceStore } from '@/store/balance';
import treasuryIcon from '@/assets/mobile/treasury.png'
import CoinbaseIcon from '@/assets/mobile/coinbase.png'
import AAVEIcon from '@/assets/mobile/aave.png'
import StableCashIcon from '@/assets/mobile/stable-cash.svg';
import BN from 'bignumber.js'

export default function APYCard() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [loaded, setLoaded] = useState(false);
  const { sevenDayApy } = useBalanceStore();

  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const observingElementRef = useRef(null);

  const baseHeight = 59;
  const aaveHeight = BN(sevenDayApy).div(5).times(baseHeight).toNumber();

  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 428

  useEffect(() => {
    setLoaded(true)
  }, [loaded])

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
      background="white"
      borderRadius="24px"
      boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
      border="1px solid #EAECF0"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="50px 10px"
        paddingBottom="6px"
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Image src={USDCIcon} />
          </Box>
          <Box marginLeft="10px">
            <Box
              fontSize="24px"
              fontWeight="700"
              lineHeight="30px"
            >
              Earn USDC
            </Box>
            <Box
              display="flex"
              alignItems="center"
            >
              <Box
                fontSize="14px"
                fontWeight="700"
                lineHeight="18px"
              >
                on AAVE |
              </Box>
              <Box
                fontSize="14px"
                fontWeight="400"
                marginLeft="4px"
                lineHeight="18px"
              >
                OP Mainnet
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" marginTop="16px">
          <Box
            fontSize="72px"
            fontWeight="700"
          >
            {sevenDayApy}
          </Box>
          <Box
            fontSize="24px"
            fontWeight="700"
            marginTop="24px"
            marginLeft="10px"
          >
            %
          </Box>
        </Box>
        <Flex align={'center'} gap="1px">
          <Box  fontSize="18px" fontWeight="600">
            7D Average APY
          </Box>
          <Image src={IconQuestion} onClick={()=> onOpen()} />
        </Flex>
      </Box>
      <Box display="flex" overflow="hidden">
        <Box
          width="33.33%"
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          transform={loaded ? 'translateY(0)' : 'translateY(100%)'}
          opacity={loaded ? 1 : 0}
          transition="all 0.5s ease"
        >
          <Box
            width="40px"
            height={`${baseHeight}px`}
            borderRadius="12px 12px 0 0"
            background="linear-gradient(180deg, rgba(73, 126, 230, 0.60) 0%, rgba(73, 126, 230, 0.10) 100%)"
            display="flex"
            alignItems="flex-start"
            paddingTop="6px"
            justifyContent="center"
          >
            <Image width="28px" height="28px" src={CoinbaseIcon} className="icon" />
          </Box>
        </Box>
        <Box
          width="33.33%"
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          transform={loaded ? 'translateY(0)' : 'translateY(100%)'}
          opacity={loaded ? 1 : 0}
          transition="all 0.5s ease 0.5s"
        >
          <Box
            width="40px"
            height={`${baseHeight}px`}
            borderRadius="12px 12px 0 0"
            background="linear-gradient(180deg, rgba(252, 209, 22, 0.60) 0%, rgba(252, 209, 22, 0.10) 100%)"
            display="flex"
            alignItems="flex-start"
            paddingTop="6px"
            justifyContent="center"
          >
            <Image width="28px" height="28px" src={treasuryIcon} className="icon" />
          </Box>
        </Box>
        <Box
          width="33.33%"
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          transform={loaded ? 'translateY(0)' : 'translateY(100%)'}
          opacity={loaded ? 1 : 0}
          transition="all 0.5s ease 1s"
        >
          <Box
            width="40px"
            height={`${aaveHeight}px`}
            borderRadius="12px 12px 0 0"
            background="linear-gradient(180deg, rgba(121, 121, 121, 0.6) 0%, rgba(215, 215, 215, 0.1) 100%)"
            display="flex"
            alignItems="flex-start"
            paddingTop="6px"
            justifyContent="center"
          >
            <Image width="28px" height="28px" src={StableCashIcon} className="icon" />
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        borderTop="1px solid rgba(0, 0, 0, 0.1)"
      >
        <Box
          width="33.33%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="18px 10px"
        >
          <Box
            fontWeight="600"
            fontSize="14px"
            textAlign="center"
          >
            5.01% APY
          </Box>
          <Box

            fontWeight="600"
            fontSize="12px"
            color="rgba(0, 0, 0, 0.5)"
            marginTop="5px"
            textAlign="center"
          >
            Coinbase
          </Box>
        </Box>
        <Box
          width="33.33%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="18px 10px"
        >
          <Box

            fontWeight="600"
            fontSize="14px"
            textAlign="center"
          >
            5.03% APY
          </Box>
          <Box

            fontWeight="600"
            fontSize="12px"
            color="rgba(0, 0, 0, 0.5)"
            marginTop="5px"
            textAlign="center"
          >
            T-Bills
          </Box>
        </Box>
        <Box
          width="33.33%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="18px 10px"
        >
          <Box

            fontWeight="600"
            fontSize="14px"
            textAlign="center"
          >
            {sevenDayApy}% APY
          </Box>
          <Box

            fontWeight="600"
            fontSize="12px"
            color="rgba(0, 0, 0, 0.5)"
            marginTop="5px"
            textAlign="center"
          >
            Stable.cash
          </Box>
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
          height="428px"
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
              height="120px"
              width="120px"
              borderRadius="120px"
              marginBottom="30px"
            />
            <Box fontSize="24px" fontWeight="700" marginBottom="14px" textAlign={'center'}>
              Where does the yield come from
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="40px"
            >
              The APY data is acquired from <CLink href="https://www.vaults.fyi/vaults" textDecoration={"underline"} >https://www.vaults.fyi/vaults</CLink>, presented and shown by Stable.cash.
            </Box>
            <Box width="100%">
              <Button onClick={()=> onClose()} size="xl" type="black" width="100%">Got it</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
