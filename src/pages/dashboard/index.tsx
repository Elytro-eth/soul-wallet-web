import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Image, Flex } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import MoreIcon from '@/components/Icons/mobile/More';
import SendIcon from '@/components/Icons/mobile/Send';
import ReceiveIcon from '@/components/Icons/mobile/Receive';
import ActivitiesIcon from '@/components/Icons/mobile/Activities';
// import USDCIcon from '@/assets/tokens/usdc.png';
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit';
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer';
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import BN from 'bignumber.js';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import HistoryIcon from '@/components/Icons/mobile/History';
import GoToIcon from '@/assets/mobile/goto.svg';
import { useOutletContext } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';
import useScreenSize from '@/hooks/useScreenSize'
import IconSetting from '@/assets/icons/setting.svg';
import { useAddressStore } from '@/store/address';
import { useGuardianStore } from '@/store/guardian';
import { ZeroHash } from 'ethers';

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


export function Header({ openMenu, username, ...props }: any) {
  const { walletName, selectedAddress } = useAddressStore();
  return (
    <Box
      height="44px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="0 30px"
      background="white"
      position="relative"
      {...props}
    >
      <Box display="flex" gap="2" alignItems="center" justifyContent="center">
        <Box fontSize="16px" lineHeight={"20px"} fontWeight="700"></Box>
      </Box>
      <Box fontSize="18px" fontWeight="700" color="black" lineHeight="24px">
        <Box background="white" height="36px" width="36px" borderRadius="36px" display="flex" alignItems="center" justifyContent="center" onClick={openMenu}>
          <Box
            width="36px"
            height="36px"
            borderRadius="36px"
            boxShadow="0px 4px 20px 0px rgba(60, 61, 69, 0.1)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={IconSetting} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const { openFullScreenModal } = useWalletContext()
  const { totalUsdValue, totalTrialValue, tokenBalance } = useBalanceStore();
  const { historyList } = useHistoryStore();
  const { innerHeight } = useScreenSize()
  const [modalMargin, setModalMargin] = useState(494);
  const [modalHeight, setModalHeight] = useState(innerHeight - 494);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [modalPosition, setModalPosition] = useState('bottom');
  const {guardiansInfo} = useGuardianStore();
  const [isMoving, setIsMoving] = useState(false);
  const { navigate } = useBrowser();
  const { walletName } = useAddressStore();
  // const { openModal } = useNavigation()
  const [openModal] = useOutletContext<any>();
  const contentRef = useRef();
  const [activeMenu, setActiveMenu] = useState('apps')

  const totalShowBalance = BN(totalUsdValue).plus(totalTrialValue).toFixed(2);

  const valueLeft = totalShowBalance.split('.')[0];
  const valueRight = totalShowBalance.split('.')[1];

  const fontSize = getFontSize(valueLeft);
  const smFontSize = getSmallFontSize(valueRight);
  const fontBottomMargin = getFontBottomMargin(valueLeft);

  const [startPosition, setStartPosition] = useState(null);
  /*
   *   useMotionValueEvent(scrollY, 'change', (latest) => {
   *     console.log('Page scroll: ', latest);
   *   });
   *  */
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

  // const handleTouchStart = (e: any) => {
  //   handleStart(e.touches[0].clientY);
  // };

  // const handleTouchMove = (e: any) => {
  //   handleMove(e.touches[0].clientY);
  // };

  // const handleMouseDown = (e: any) => {
  //   handleStart(e.clientY);
  // };

  // const handleMouseMove = (e: any) => {
  //   // Only track movement when the mouse button is pressed
  //   if (e.buttons === 1) {
  //     handleMove(e.clientY);
  //   }
  // };

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
          setModalHeight(innerHeight - 64);
          setModalPosition('top');
        } else {
          const height = getContentHeight();
          setModalMargin(height);
          setModalPosition('bottom');

          setTimeout(() => {
            setModalHeight(innerHeight - height);
          }, 620);
        }

        setTimeout(() => {
          setIsMoving(false);
        }, 600);
      }
    },
    [modalPosition, isMoving, innerHeight],
  );

  const finalHistoryList = showFullHistory ? historyList : historyList.slice(0, 2);
  // const finalHistoryList = historyList

  console.log('innerHeight', innerHeight)
  return (
    <Box
      height={innerHeight}
      background="linear-gradient(180deg, #FBFBFB 0%, #F0F0F0 100%)"
    >
      <Header
        paddingTop="10px"
        paddingBottom="10px"
        height="64px"
        background="transparent"
        openMenu={() => openModal('settings')}
      />
      <Box padding={{ xs: '20px', sm: '30px' }} height={innerHeight - 64} overflowY="scroll">
        <Box
          ref={(v: any) => {
            contentRef.current = v;
          }}
        >
          <Box marginBottom="24px">
            <Box fontWeight="700" fontSize="18px">
              Hi, {walletName}
            </Box>
            <Box fontWeight="700" fontSize="42px" lineHeight="50px" marginTop="8px">
              Welcome to<br />
              Ethereum
            </Box>
          </Box>
          {(!guardiansInfo || !guardiansInfo.guardianHash || guardiansInfo.guardianHash === ZeroHash) && <Box
            display="flex"
            alignItems="center"
            width="100%"
            minHeight="38px"
            borderRadius="38px"
            background="white"
            padding="10px 18px"
            color="#324174"
            justifyContent="space-between"
            marginBottom="40px"
            fontSize="14px"
            onClick={() => navigate('/verify-email')}
          >
            <Box>Verify Email to Get <Box as="span" fontWeight="700">10 USDC</Box> for free</Box>
            <Box>
              <Image src={GoToIcon} />
            </Box>
          </Box>}
          
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
            position="relative"
            zIndex="1"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              padding="24px"
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
                  onClick={() => openFullScreenModal('receive')}
                >
                  <Box><ReceiveIcon /></Box>
                  <Box color="#5B606D" fontSize="14px" fontWeight="600" marginTop="4px">Receive</Box>
                </Box>
                <Box
                  marginRight="30px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  onClick={() => openFullScreenModal('activity')}
                >
                  <Box><ActivitiesIcon /></Box>
                  <Box color="#5B606D" fontSize="14px" fontWeight="600" marginTop="4px">Activity</Box>
                </Box>
              </Box>
            </Box>
            <Box padding="24px 30px" paddingBottom="0" borderTop="1px solid rgba(0, 0, 0, 0.1)">
              <Box marginBottom="18px" display="flex" alignItems="center" justifyContent="space-between">
                <Box fontSize="16px" fontWeight="600">Tokens</Box>
                <Box fontSize="14px" fontWeight="400" color="rgba(0, 0, 0, 0.5)">${totalUsdValue}</Box>
              </Box>
              {tokenBalance.map((item: any, index: number) => <Box
                display="flex"
                alignItems="center"
                marginBottom="28px"
              >
                <Box marginRight="10px">
                  <Image src={item.logoURI} w="10" />
                </Box>
                <Box fontWeight="700" fontSize="16px">
                  {item.name}
                </Box>
                <Box marginLeft="auto" display="flex" flexDirection="column" alignItems="flex-end">
                  <Box fontWeight="700" fontSize="20px">{item.tokenBalanceFormatted}</Box>
                  {/* <Box fontSize="12px" color="rgba(0, 0, 0, 0.5)">$10.11</Box> */}
                </Box>
              </Box>)}
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
