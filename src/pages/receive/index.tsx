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
import Header from '@/components/mobile/Header';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { useHistoryStore } from '@/store/history';
import useWalletContext from '@/context/hooks/useWalletContext';
import 'swiper/css';
import 'swiper/css/pagination';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import Button from '@/components/mobile/Button';
import OpIcon from '@/assets/mobile/op.png';
import QuestionIcon from '@/components/Icons/Question';
import ReceiveCode from '@/components/ReceiveCode';
import useTools from '@/hooks/useTools';
import useScreenSize from '@/hooks/useScreenSize';
import useConfig from '@/hooks/useConfig';
import { isPwaMode } from '@/lib/tools';

export default function Receive({ isModal, registerScrollable }: any) {
  const { closeModal } = useWalletContext();
  const navigate = useNavigate();
  const { chainConfig } = useConfig();
  const [swiper, setSwiper] = useState<any>(null);
  const [step, setStep] = useState(0);
  const { selectedAddress } = useAddressStore();
  const { doCopy } = useTools();
  const [isPaginationActive, setIsPaginationActive] = useState(false);
  const { historyList } = useHistoryStore();
  const { selectedChainId } = useChainStore();
  const { openModal } = useWalletContext();
  const { innerHeight } = useScreenSize();

  const isPwa = isPwaMode();

  const onPrev = useCallback(async () => {
    console.log('prev');

    if (step > 0) {
      // setStep(step - 1)
      swiper.slidePrev();
    } else {
      if (historyList.length) {
        navigate('/dashboard');
        return;
      }
      // get history length
      const res = await api.op.list(selectedAddress, [selectedChainId]);
      if (res.data.history.length) {
        navigate('/dashboard');
      } else {
        navigate('/intro');
      }
    }
  }, [step, swiper]);

  const onNext = useCallback(() => {
    console.log('next', swiper);
    // setStep(step + 1)
    swiper.slideNext();
  }, [swiper]);

  const onSlideChange = useCallback((swiper: any) => {
    setStep(swiper.activeIndex);
  }, []);

  const onInit = useCallback((swiper: any) => {
    setSwiper(swiper);
  }, []);

  useEffect(() => {
    /* const swiper = new Swiper('.swiper', {
     *   // ...
     * });
     * swiper.on('slideChange', function () {
     *   console.log('slide changed');
     * }); */
    setIsPaginationActive(true);
  }, []);

  return (
    <Box
      width="100%"
      height={{
        sm: innerHeight,
        md: '100%',
      }}
      overflowY="scroll"
      background={{
        sm: '#F2F3F5',
        md: 'white',
      }}
      display="flex"
      alignItems={{ sm: 'center', md: 'flex-start' }}
      justifyContent="center"
    >
      <Box
        marginTop="0px"
        padding="30px 8px"
        minHeight={{
          sm: isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)',
          md: isModal ? 'calc(100%)' : 'calc(100vh - 62px)'
        }}
        width={{
          sm: '100%',
          md: '380px'
        }}
      >
        <Box fontSize="28px" fontWeight="500" padding="0 24px">
          Receive
        </Box>
        <Box marginTop="20px">
          <Box
            width="100%"
            borderRadius="32px"
            boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
            border="1px solid #EAECF0"
            paddingBottom="42px"
            position="relative"
            zIndex="1"
            overflow="hidden"
            background="white"
          >
            <Box
              // background="#FFEBEB"
              padding="12px"
              display="flex"
              alignItems="center"
            >
              <Box marginRight="8px">
                <Image width="40px" height="40px" src={OpIcon} />
              </Box>
              <Box>
                <Box fontSize="20px" fontWeight="500">
                  {chainConfig.chainName}
                </Box>
                <Box fontSize="12px" color="#676B75">
                  Only send Optimism assets to this address
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop={{ sm: '40px', md: '10px' }}>
              <Box
                display="flex"
                alignItems="center"
                width={{
                  sm: '205px',
                  md: '144px'
                }}
                height={{
                  sm: '205px',
                  md: '144px'
                }}
              >
                <ReceiveCode
                  address={selectedAddress}
                  width={{
                    sm: '205px',
                    md: '144px'
                  }}
                  height={{
                    sm: '205px',
                    md: '144px'
                  }}
                  onSet={() => {}}
                />
              </Box>
              <Box
                fontSize="18px"
                lineHeight="25px"
                display="inline-block"
                textAlign="center"
                maxWidth="313px"
                marginTop="14px"
                color="#161F36"
              >
                <Text as="span" fontWeight="500" color={chainConfig.chainColor}>{chainConfig.chainPrefix}</Text>
                <Text as="span" color="#161F36">
                  {selectedAddress}
                </Text>
              </Box>
              <Box marginTop="24px" width="174px">
                <Button
                  fontWeight="400"
                  size="xl"
                  type="white"
                  width="174px"
                  height="47px"
                  onClick={() => doCopy(`${chainConfig.chainPrefix}${selectedAddress}`)}
                >
                  Copy address
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            fontSize="14px"
            color="rgba(0, 0, 0, 0.5)"
            width="100%"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            {...isPwa ? {
              position: "absolute",
              bottom: "32px"
            } : {
              marginTop: '20px',
            }}
            onClick={() => openModal('receiveSteps')}
            cursor="pointer"
          >
            <Box as="span" marginRight="4px">
              How to send crypto to this address?
            </Box>
            <QuestionIcon size="16" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
