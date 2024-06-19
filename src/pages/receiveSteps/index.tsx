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
import CheckDeposit from './CheckDeposit'
import MakeTransfer from './MakeTransfer'
import SelectNetwork from './SelectNetwork'
import SendToken from './SendToken'
import ConfirmTransaction from './ConfirmTransaction'
import FadeSwitch from '@/components/FadeSwitch';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { useHistoryStore } from '@/store/history';
import useWalletContext from '@/context/hooks/useWalletContext';
import 'swiper/css';
import 'swiper/css/pagination';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import Button from '@/components/mobile/Button'
import useScreenSize from '@/hooks/useScreenSize'
// import { Pagination } from 'swiper/modules';

const Pagination = ({ isActive, count, activeIndex, onNext, onFinish }: any) => {
  const navigate = useNavigate();
  return (
    <Box
      position="fixed"
      left="0"
      bottom="0"
      opacity={isActive ? 1 : 0}
      pointerEvents={isActive ? 'all' : 'none'}
      width="100%"
      paddingTop="20px"
      paddingBottom="36px"
      background="white"
      zIndex="1"
    >
      <Box display="flex" alignItems="center" justifyContent="center" marginBottom="24px">
        {Array(count || 0).fill(1).map((_: any, i: any) =>
          <Box key={i} width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background={i === activeIndex ? 'black' : '#D9D9D9'} />
        )}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        {activeIndex !== 3 && (
          <Box display="flex" alignItems="center" justifyContent="center" marginTop="10px">
            <Button type="white" size="xl" width="148px" onClick={onNext}>Next</Button>
          </Box>
        )}
        {activeIndex === 3 && (
          <Box display="flex" alignItems="center" justifyContent="center" marginTop="10px">
            <Button type="blue" size="xl" width="148px" onClick={onFinish}>Done</Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default function Deposit({ isModal, registerScrollable }: any) {
  const { closeModal } = useWalletContext()
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<any>(null)
  const [step, setStep] = useState(0)
  const [isPaginationActive, setIsPaginationActive] = useState(false)
  const { historyList } = useHistoryStore();
  const {selectedChainId} = useChainStore();
  const { selectedAddress } = useAddressStore();
  const screenSize = useScreenSize()
  const innerHeight = isModal ? (screenSize.innerHeight - 40) : screenSize.innerHeight

  const onFinish = useCallback(async() => {
    if (isModal) {
      closeModal()
    }

    if (historyList.length) {
      // navigate('/dashboard')
    } else {
      // navigate('/intro')
    }
  }, [isModal])

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
      const res = await api.op.list(selectedAddress, [selectedChainId ]);
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
    <Box width="100%" height={innerHeight} overflow="hidden">
      <Header
        title=""
        showBackButton={!isModal}
        onBack={onPrev}
      />
      <Swiper
        className="mySwiper"
        onSlideChange={onSlideChange}
        onInit={onInit}
      >
        <SwiperSlide>
          <MakeTransfer onPrev={onPrev} onNext={onNext} isModal={isModal} registerScrollable={registerScrollable} />
        </SwiperSlide>
        <SwiperSlide>
          <SelectNetwork onPrev={onPrev} onNext={onNext} isModal={isModal} registerScrollable={registerScrollable} />
        </SwiperSlide>
        <SwiperSlide>
          <SendToken onFinish={onFinish} isModal={isModal} registerScrollable={registerScrollable} />
        </SwiperSlide>

        <SwiperSlide>
          <ConfirmTransaction onFinish={onFinish} isModal={isModal} registerScrollable={registerScrollable} />
        </SwiperSlide>
      </Swiper>
      <Pagination isActive={isPaginationActive} activeIndex={step} count={4} onNext={onNext} onFinish={onFinish} />
    </Box>
  );
}
