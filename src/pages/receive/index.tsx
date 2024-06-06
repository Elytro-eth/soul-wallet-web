import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Image,
  Checkbox,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import api from '@/lib/api';
import NextIcon from '@/components/Icons/mobile/Next';
import Header from '@/components/mobile/Header'
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { useHistoryStore } from '@/store/history';
import useWalletContext from '@/context/hooks/useWalletContext';
import 'swiper/css';
import 'swiper/css/pagination';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import Button from '@/components/mobile/Button'
import OpIcon from '@/assets/mobile/op.png'
import QuestionIcon from '@/components/Icons/Question'

export default function Receive({ isModal, registerScrollable }: any) {
  const { closeModal } = useWalletContext()
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<any>(null)
  const [step, setStep] = useState(0)
  const [isPaginationActive, setIsPaginationActive] = useState(false)
  const { historyList } = useHistoryStore();
  const {selectedChainId} = useChainStore();
  const { selectedAddress } = useAddressStore();
  const { openModal } = useWalletContext()
  const innerHeight = isModal ? (window.innerHeight - 40) : window.innerHeight

  const onPrev = useCallback(async() => {
    console.log('prev')

    if (step > 0) {
      // setStep(step - 1)
      swiper.slidePrev()
    }else{
      if(historyList.length){
        navigate('/dashboard')
        return
      }
      // get history length
      const res = await api.token.history({ address: selectedAddress, chainID: selectedChainId });
      if (res.data.history.length) {
        navigate('/dashboard')
      } else {
        navigate('/intro')
      }
    }
  }, [step, swiper])

  const onNext = useCallback(() => {
    console.log('next', swiper)
    // setStep(step + 1)
    swiper.slideNext()
  }, [swiper])

  const onSlideChange = useCallback((swiper: any) => {
    setStep(swiper.activeIndex)
  }, [])

  const onInit = useCallback((swiper: any) => {
    setSwiper(swiper)
  }, [])

  useEffect(() => {
    /* const swiper = new Swiper('.swiper', {
     *   // ...
     * });
     * swiper.on('slideChange', function () {
     *   console.log('slide changed');
     * }); */
    setIsPaginationActive(true)
  }, [])

  console.log('isModal', isModal)
  return (
    <Box width="100%" height={innerHeight} overflowY="scroll">
      <Header
        title=""
        showBackButton={!isModal}
        onBack={onPrev}
      />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        <Box fontSize="32px" fontWeight="700">
          Receive
        </Box>
        <Box marginTop="60px">
          <Box
            width="100%"
            background="white"
            borderRadius="24px"
            boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
            border="1px solid #EAECF0"
            paddingBottom="42px"
            position="relative"
            zIndex="1"
            overflow="hidden"
          >
            <Box
              background="#FFEBEB"
              padding="12px"
              display="flex"
              alignItems="center"
            >
              <Box marginRight="8px">
                <Image width="24px" height="24px" src={OpIcon} />
              </Box>
              <Box>
                <Box fontSize="16px" fontWeight="600">Optimism network</Box>
                <Box fontSize="12px">Only send Optimism assets to this address</Box>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              marginTop="40px"
            >
              <Box
                display="flex"
                alignItems="center"
                width="205px"
                height="205px"
                background="rgba(0, 0, 0, 0.2)"
              >

              </Box>
              <Box
                fontWeight="500"
                fontSize="14px"
                display="inline-block"
                textAlign="center"
                maxWidth="205px"
                marginTop="14px"
              >
                <Box as="span" fontWeight="700">Op:</Box><br />0xFDF7AC7Be34f2882734b1e6A8f39656D6B14691C
              </Box>
              <Box marginTop="24px" width="205px">
                <Button size="xl" type="white" width="100%">Copy address</Button>
              </Box>
            </Box>
          </Box>
          <Box
            fontSize="14px"
            color="rgba(0, 0, 0, 0.5)"
            width="100%"
            textAlign="center"
            marginTop="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => openModal('receiveSteps')}
          >
            <Box as="span" marginRight="4px">How to send crypto to this address?</Box>
            <QuestionIcon size="16" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
