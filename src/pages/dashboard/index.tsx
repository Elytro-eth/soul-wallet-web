import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Image, Flex } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import MoreIcon from '@/components/Icons/mobile/More';
import SendIcon from '@/components/Icons/mobile/Send';
import ReceiveIcon from '@/components/Icons/mobile/Receive';
import ActivitiesIcon from '@/components/Icons/mobile/Activities';
import USDCIcon from '@/assets/tokens/usdc.png';
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit';
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer';
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import BN from 'bignumber.js';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import HistoryIcon from '@/components/Icons/mobile/History';
import { useOutletContext } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';

const getFontSize = (value: any) => {
  const length = value ? String(value).length : 0;

  if (length > 9) {
    return '24px';
  } else if (length > 7) {
    return '36px';
  } else if (length > 5) {
    return '40px';
  } else if (length > 3) {
    return '50px';
  }

  return '72px';
};

const getSmallFontSize = (value: any) => {
  const length = value ? String(value).length : 0;

  return '24px'

  // if (length > 2) {
  //   return '24px';
  // } else if (length > 1) {
  //   return '32px';
  // }

  // return '36px';
};

const getFontBottomMargin = (value: any) => {
  const length = value ? String(value).length : 0;

  if (length > 9) {
    return '0px';
  } else if (length > 5) {
    return '10px';
  }

  return '20px';
};

export default function Dashboard() {
  const { openFullScreenModal } = useWalletContext()
  const { totalUsdValue, totalTrialValue, getTokenBalance, sevenDayApy, oneDayInterest } = useBalanceStore();
  const { historyList } = useHistoryStore();
  const [modalMargin, setModalMargin] = useState(494);
  const [modalHeight, setModalHeight] = useState(window.innerHeight - 494);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [modalPosition, setModalPosition] = useState('bottom');
  const [isMoving, setIsMoving] = useState(false);
  // const { openModal } = useNavigation()
  const [openModal] = useOutletContext<any>();
  const contentRef = useRef();
  const [activeMenu, setActiveMenu] = useState('apps')

  const pendingUsdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_USDC);

  const totalShowBalance = BN(totalUsdValue).plus(totalTrialValue).toFixed(2);

  const hasBalance = BN(totalShowBalance).isGreaterThan(0);

  const valueLeft = totalShowBalance.split('.')[0];
  const valueRight = totalShowBalance.split('.')[1];

  const fontSize = getFontSize(valueLeft);
  const smFontSize = getSmallFontSize(valueRight);
  const fontBottomMargin = getFontBottomMargin(valueLeft);

  const [startPosition, setStartPosition] = useState(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    console.log('Page scroll: ', latest);
  });

  useEffect(() => {
    getContentHeight();
    console.log('contentRef', contentRef);
  }, []);

  const handleStart = (position: any) => {
    setStartPosition(position);
  };

  const openActivity = () => {
    console.log('openActivity');
    openModal('activity');
  };

  const handleMove = (currentPosition: any) => {
    if (startPosition == null) return;

    if (startPosition > currentPosition + 20) {
      console.log('Moving up');
      changeModalPosition('top');
      setTimeout(() => {
        setShowFullHistory(true);
      }, 600);
    } else if (startPosition < currentPosition - 20) {
      console.log('Moving down');
      changeModalPosition('bottom');
      setTimeout(() => {
        setShowFullHistory(false);
      }, 600);
    }
  };

  const handleTouchStart = (e: any) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: any) => {
    handleMove(e.touches[0].clientY);
  };

  const handleMouseDown = (e: any) => {
    handleStart(e.clientY);
  };

  const handleMouseMove = (e: any) => {
    // Only track movement when the mouse button is pressed
    if (e.buttons === 1) {
      handleMove(e.clientY);
    }
  };

  const getContentHeight = () => {
    const elem: any = contentRef.current;

    if (elem) {
      return elem.clientHeight + 62 + 60 - 6;
    }

    return 494;
  };

  const changeModalPosition = useCallback(
    (intentPosition: any) => {
      if (!isMoving && intentPosition !== modalPosition) {
        setIsMoving(true);

        if (modalPosition === 'bottom') {
          setModalMargin(64);
          setModalHeight(window.innerHeight - 64);
          setModalPosition('top');
        } else {
          const height = getContentHeight();
          setModalMargin(height);
          setModalPosition('bottom');

          setTimeout(() => {
            setModalHeight(window.innerHeight - height);
          }, 620);
        }

        setTimeout(() => {
          setIsMoving(false);
        }, 600);
      }
    },
    [modalPosition, isMoving],
  );

  const finalHistoryList = showFullHistory ? historyList : historyList.slice(0, 2);
  // const finalHistoryList = historyList

  return (
    <Box>
      <Box padding={{ xs: '20px', sm: '30px' }}>
        <Box
          ref={(v: any) => {
            contentRef.current = v;
          }}
        >
          <Box marginBottom="24px">
            <Box fontWeight="700" fontSize="18px">
              Hi, Andy
            </Box>
            <Box fontWeight="700" fontSize="42px" lineHeight="50px" marginTop="8px">
              Welcome to<br />
              Ethereum
            </Box>
          </Box>
          <Box display="flex" marginBottom="36px">
            <Box marginRight="24px" fontSize="24px" fontWeight={(activeMenu === 'apps') ? 700 : 400} position="relative" onClick={() => setActiveMenu('apps')}>
              Apps
              {(activeMenu === 'apps') && <Box position="absolute" bottom="-10px" left="calc(50% - 12px)" height="4px" width="24px" background="#7386C7" borderRadius="4px" />}
            </Box>
            <Box fontSize="24px" position="relative" fontWeight={(activeMenu === 'assets') ? 700 : 400} onClick={() => setActiveMenu('assets')}>
              Assets
              {(activeMenu === 'assets') && <Box position="absolute" bottom="-10px" left="calc(50% - 12px)" height="4px" width="24px" background="#7386C7" borderRadius="4px" />}
            </Box>
          </Box>
          <Box
            width="100%"
            background="white"
            borderRadius="24px"
            boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
            border="1px solid #EAECF0"
            padding="24px"
            paddingBottom="42px"
            position="relative"
            zIndex="1"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              // fontFamily={"Nunito"}
            >
              <Box display="flex" alignItems="center">
                <Box fontSize="24px" fontWeight="700" marginRight="2px">
                  $
                </Box>
                <Box
                  fontSize={fontSize}
                  lineHeight={'1'}
                  fontWeight="700"
                  sx={{
                    '@property --num': {
                      syntax: `'<integer>'`,
                      initialValue: '0',
                      inherits: 'false',
                    },
                    '&': {
                      transition: '--num 1s',
                      counterReset: 'num var(--num)',
                      '--num': valueLeft,
                    },
                    '&::after': {
                      content: 'counter(num)',
                    },
                  }}
                />
                {valueRight &&
                 BN(valueRight).isGreaterThan(0) &&
                 Number(valueRight.slice(0, 3).replace(/0+$/, '')) > 0 && (
                   <Box
                     fontSize={smFontSize}
                     lineHeight={'1'}
                     fontWeight="700"
                     marginTop={fontBottomMargin}
                     // marginLeft="10px"
                     color="#939393"
                   >
                     .
                     <Box
                       as="span"
                       sx={{
                         '@property --num': {
                           syntax: `'<integer>'`,
                           initialValue: '0',
                           inherits: 'false',
                         },
                         '&': {
                           transition: '--num 1s',
                           counterReset: 'num var(--num)',
                           '--num': valueRight.slice(0, 3).replace(/0+$/, ''),
                         },
                         '&::after': {
                           content: 'counter(num)',
                         },
                       }}
                     />
                   </Box>
                )}
              </Box>
              <Box marginTop="20px" display="flex">
                <Box
                  marginRight="30px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  onClick={() => openFullScreenModal('send')}
                >
                  <Box><SendIcon /></Box>
                  <Box color="#5B606D" fontSize="14px" fontWeight="600" marginTop="4px">Send</Box>
                </Box>
                <Box
                  marginRight="30px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box><ReceiveIcon /></Box>
                  <Box color="#5B606D" fontSize="14px" fontWeight="600" marginTop="4px">Receive</Box>
                </Box>
                <Box
                  marginRight="30px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box><ActivitiesIcon /></Box>
                  <Box color="#5B606D" fontSize="14px" fontWeight="600" marginTop="4px">Activity</Box>
                </Box>
              </Box>
            </Box>
          </Box>
          {finalHistoryList && finalHistoryList.length > 0 && (
            <Box
              width="100%"
              background="white"
              boxShadow="0px -4px 60px 0px rgba(44, 53, 131, 0.08)"
              padding="24px 0"
              borderRadius="24px"
              marginTop="27px"
            >
              <Box>
                <Box
                  width="100%"
                  fontSize="18px"
                  fontWeight="700"
                  paddingBottom="10px"
                  paddingLeft="22px"
                  paddingRight="22px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>Activity</Box>
                  <Box onClick={() => openActivity()}>
                    <HistoryIcon />
                  </Box>
                </Box>
              </Box>
              <Flex
                gap="36px"
                padding="0"
                flexDir="column"
                width="100%"
                overflow="auto"
                maxHeight={`${40 * 4 + 36 * 3}px`}
              >
                {finalHistoryList.map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    height="40px"
                    paddingLeft="22px"
                    paddingRight="22px"
                  >
                    <Box marginRight="12px">
                      {item.action === 'Deposit' ? <ActivityDepositIcon /> : <ActivityTransferIcon />}
                    </Box>
                    <Box>
                      <Box display="flex" alignItems="center">
                        <Box fontSize="14px" fontWeight="700">
                          {item.action}
                        </Box>
                        {/* <Box
                            fontSize="12px"
                            background="#F1F1F1"
                            color="rgba(0, 0, 0, 0.60)"
                            padding="0 8px"
                            borderRadius="4px"
                            marginLeft="8px"
                            >
                            Pending
                            </Box> */}
                      </Box>
                      <Box fontSize="12px">{item.dateFormatted}</Box>
                    </Box>
                    <Box marginLeft="auto">
                      <Box fontSize="14px" fontWeight="700">
                        {item.amountFormatted} USDC
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
