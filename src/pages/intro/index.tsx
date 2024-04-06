import { useState, useEffect } from 'react'
import { Link as RLink, useNavigate } from 'react-router-dom';
import { Box, Image, Modal, ModalOverlay, ModalContent, Link, Text, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import QuestionIcon from '@/components/Icons/mobile/Question'
import USDCIcon from '@/assets/tokens/usdc.png'
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import treasuryIcon from '@/assets/mobile/treasury.png'
import CoinbaseIcon from '@/assets/mobile/coinbase.png'
import AAVEIcon from '@/assets/mobile/aave.png'
import BN from 'bignumber.js'
import APYCard from '@/components/mobile/APYCard'

export default function Intro() {
  const [loaded, setLoaded] = useState(false);
  const { sevenDayApy,} = useBalanceStore();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { historyList } = useHistoryStore();
  const navigate = useNavigate();

  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 428

  const baseHeight = 59;
  const aaveHeight = BN(sevenDayApy).div(5).times(baseHeight).toNumber();

  useEffect(()=>{
    if(historyList.length){
      navigate('/dashboard')
    }
  }, [historyList])

  useEffect(() => {
    setLoaded(true)
  }, [loaded])

  return (
    <Box
      width="100%"
      height="100%"
      // background="linear-gradient(180deg, #FBFBFB 0%, #F0F0F0 100%)"
    >
      <Box width="100%" padding="30px" display="flex" alignItems="center" flexDirection="column">
        <Box  fontSize="36px" fontWeight="700" textAlign="center" lineHeight="56px">
          Deposit and earn
        </Box>
        <Box  fontSize="14px" fontWeight="500" textAlign="center" marginTop="14px">
          Deposit to your Stable.cash account, get <Text as="span" fontWeight="700">auto-saved</Text> into the best interest rate pool and start earning today!
        </Box>
        <Link as={RLink} to="/deposit" mt="50px">
          <Button size="xl" type="black" minWidth="283px">Deposit USDC</Button>
        </Link>
        <Button
          size="xl"
          type="text"
          minWidth="283px"
          marginTop="10px"
          color="black"
          marginBottom="20px"
          onClick={onOpen}
        >
          What’s auto-saving <Box display="flex" alignItems="center" justifyContent="center" width="14px" height="14px" border="1px solid black" borderRadius="14px"><QuestionIcon /></Box>
        </Button>
        <APYCard />
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay />
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
            md: 'calc(50vh - 214px)'
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
              mt="24px"
            />
            <Box fontSize="24px" width="100%" textAlign="center" fontWeight="700" marginBottom="14px">
              Auto-saving
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="28px"
            >
              Your assets will be auto saved into AAVE protocol.
              You can transfer anytime after deposited.
            </Box>
            <Box width="100%">
              <Button size="xl" type="black" width="100%" onClick={onClose}>Got it</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
