import { useState, useCallback, useRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Image,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import MoreIcon from '@/components/Icons/mobile/More';
import SendIcon from '@/components/Icons/mobile/Send2';
import ReceiveIcon from '@/components/Icons/mobile/Receive2';
import ActivitiesIcon from '@/components/Icons/mobile/Activities';
// import USDCIcon from '@/assets/tokens/usdc.png';
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit';
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer';
import AppsIcon from '@/components/Icons/mobile/Apps';
import AssetsIcon from '@/components/Icons/mobile/Assets';
import DotsIcon from '@/components/Icons/mobile/Dots';
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import BN from 'bignumber.js';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import HistoryIcon from '@/components/Icons/mobile/History';
import GoToIcon from '@/assets/mobile/goto.svg';
import { useOutletContext } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';
import useScreenSize from '@/hooks/useScreenSize';
import IconSetting from '@/assets/icons/setting.svg';
import { useAddressStore } from '@/store/address';
import { useGuardianStore } from '@/store/guardian';
import { ZeroHash } from 'ethers';
import { toFixed } from '@/lib/tools';
import USDCIcon from '@/assets/mobile/usdc.png'
import AAVEIcon from '@/assets/mobile/aave.png'
import ThemePage from '@/components/ThemeChange';
import AddressIcon from '@/components/AddressIcon';
import EmptyIcon from '@/assets/empty2.svg'
import SettingPage from '@/pages/settings'
import useConfig from '@/hooks/useConfig';

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

  return '56px';
};

const getSmallFontSize = (value: any) => {
  const length = value ? String(value).length : 0;

  return '24px';

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
  const { chainConfig } = useConfig();
  return (
    <Box
      height="56px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="0 24px"
      background="white"
      position="relative"
      {...props}
    >
      <Box display="flex" gap="2" alignItems="center" justifyContent="center">
        {/* <Box width="40px" height="40px">
          <AddressIcon address={selectedAddress} width={40} />
        </Box> */}
        <Image src={chainConfig.icon} width="40px" height="40px" />
        <Box fontSize="20px" lineHeight="24px" fontWeight="400" color="#161F36">
          {walletName}
        </Box>
      </Box>
      <Box fontSize="18px" fontWeight="500" color="black" lineHeight="24px">
        <Box
          height="36px"
          width="36px"
          borderRadius="36px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={openMenu}
        >
          <Box
            width="36px"
            height="36px"
            borderRadius="36px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <DotsIcon />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const { openFullScreenModal } = useWalletContext();
  const { totalUsdValue, totalTrialValue, tokenBalance } = useBalanceStore();
  const { historyList } = useHistoryStore();
  const { innerHeight } = useScreenSize();
  const [modalMargin, setModalMargin] = useState(494);
  const [modalHeight, setModalHeight] = useState(innerHeight - 494);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [modalPosition, setModalPosition] = useState('bottom');
  const { guardiansInfo } = useGuardianStore();
  const [isMoving, setIsMoving] = useState(false);
  const toast = useToast();
  const { navigate } = useBrowser();
  const { walletName } = useAddressStore();
  // const { openModal } = useNavigation()
  const [openModal] = useOutletContext<any>();
  const contentRef = useRef();
  const [activeMenu, setActiveMenu] = useState('apps')
  const { isOpen, onOpen, onClose } = useDisclosure();

  const valueLeft = totalUsdValue.split('.')[0];
  const valueRight = totalUsdValue.split('.')[1];

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

  console.log('innerHeight', innerHeight);
  return (
    <ThemePage themeColor="#F2F3F5">
      <Box height={innerHeight} background="#F2F3F5">
        <Header
          paddingTop="10px"
          paddingBottom="10px"
          height="64px"
          background="transparent"
          openMenu={onOpen}
        />
        <Box
          position="fixed"
          width="100vw"
          bottom="30px"
          left="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            background="#161F36"
            height="56px"
            borderRadius="56px"
            fontSize="18px"
            fontWeight="400"
            lineHeight="22.5px"
          >
            <Box
              color="white"
              padding="16px 32px"
              paddingRight="12px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              {...(activeMenu === 'apps' ? { opacity: 1, fontWeight: 500 } : { opacity: .6}) }
              onClick={() => setActiveMenu('apps')}
            >
              <Box marginRight="2px">
                <AppsIcon />
              </Box>
              <Box>Apps</Box>
            </Box>

            <Box
              color="white"
              padding="16px 32px"
              paddingLeft="12px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              {...(activeMenu === 'assets' ? { opacity: 1, fontWeight: 500 } : { opacity: .6}) }
              onClick={() => setActiveMenu('assets')}
            >
              <Box marginRight="2px">
                <AssetsIcon />
              </Box>
              <Box>Assets</Box>
            </Box>
          </Box>
        </Box>
        <Box padding="8px" height={innerHeight - 64} overflowY="scroll">
          <Box
            ref={(v: any) => {
              contentRef.current = v;
            }}
            display="flex"
            flexDirection="column"
          >
            {(!guardiansInfo || !guardiansInfo.guardianHash || guardiansInfo.guardianHash === ZeroHash) && (
              <Box
                paddingLeft="8px"
                paddingRight="8px"
                marginBottom="20px"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  width="100%"
                  minHeight="79px"
                  borderRadius="32px"
                  // background="white"
                  padding="12px 16px"
                  color="#0E1736"
                  justifyContent="space-between"
                  fontSize="14px"
                  background="radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)"
                  onClick={() => navigate('/verify-email')}
                >
                  <Box>
                    <Box fontSize="32px" lineHeight={"1"} fontWeight="500">$10</Box>
                    <Box fontSize="14px" lineHeight={"17px"} fontWeight="400" opacity="0.64" color="#161F36">Setup email recovery to get 10 USDC for free</Box>
                  </Box>
                  <Box>
                    <Image width="40px" height="40px" src={USDCIcon} />
                  </Box>
                </Box>
              </Box>
            )}
            {activeMenu === 'apps' && (
              <Fragment>
                <Box
                  width="100%"
                  px="2"
                  marginTop="20px"
                >
                  <Box
                    width="100%"
                    background="linear-gradient(to bottom, #E4EaED 0%, #C5DDEF 100%)"
                    borderRadius="24px"
                    padding="24px"
                    height="216px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Box fontSize="32px" fontWeight="500" color="#161F36" lineHeight="1">AAVE</Box>
                        <Box fontSize="20px" lineHeight="25px" color="#3C3F45" opacity="0.8">10.16% APY</Box>
                      </Box>
                      <Box>
                        <Image src={AAVEIcon} width="56px" height="56px" />
                      </Box>
                    </Box>
                    <Box>
                      <Button onClick={()=> toast({
                        title: 'Coming soon',
                        status: 'info',
                      })} border="none" size="xl" height="40px" width="110px" type="white">Earn now</Button>
                    </Box>
                  </Box>
                  <Box textAlign="center" width="100%" marginTop="16px" fontSize="14px" lineHeight="17.5px" opacity="0.4">
                    More apps arriving soon
                  </Box>
                </Box>
              </Fragment>
            )}
            {activeMenu === 'assets' && (
              <Fragment>
                <Box
                  width="100%"
                  px="2"
                >
                  <Box display="flex" alignItems="center">
                    <Box fontSize="56px" lineHeight={"1"} fontWeight="500" marginRight="2px">
                      $
                    </Box>
                    <Box
                      fontSize={fontSize}
                      lineHeight={'1'}
                      fontWeight="500"
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
                     Number(valueRight.slice(0, 4).replace(/0+$/, '')) > 0 && (
                       <Box
                         fontSize={fontSize}
                         lineHeight={'1'}
                         fontWeight="500"
                         // marginTop={fontBottomMargin}
                         // marginLeft="10px"
                         color="#939393"
                       >
                         .
                         <Box
                           as="span"
                         >
                           {valueRight.slice(0, 4).replace(/0+$/, '')}
                         </Box>
                       </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  width="100%"
                  display="flex"
                  paddingLeft="8px"
                  paddingRight="8px"
                  marginTop="14px"
                  marginBottom="40px"
                >
                  <Box width="calc((100% - 16px) / 3)" marginRight="8px">
                    <Box
                      background="#DCE4F2"
                      borderRadius="32px"
                      color="#161F36"
                      fontSize="18px"
                      fontWeight="400"
                      lineHeight="22.5px"
                      padding="12px 16px"
                      height="47px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => openFullScreenModal('send')}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="4px"
                      >
                        <SendIcon />
                      </Box>
                      <Box>Send</Box>
                    </Box>
                  </Box>
                  <Box width="calc((100% - 16px) / 3)" marginRight="8px">
                    <Box
                      background="#DCE4F2"
                      borderRadius="32px"
                      color="#161F36"
                      fontSize="18px"
                      fontWeight="400"
                      lineHeight="22.5px"
                      padding="12px 16px"
                      height="47px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => openFullScreenModal('receive')}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="4px"
                      >
                        <ReceiveIcon />
                      </Box>
                      <Box>Receive</Box>
                    </Box>
                  </Box>
                  <Box width="calc((100% - 16px) / 3)">
                    <Box
                      background="#DCE4F2"
                      borderRadius="32px"
                      color="#161F36"
                      fontSize="18px"
                      fontWeight="400"
                      lineHeight="22.5px"
                      padding="12px 16px"
                      height="47px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => openFullScreenModal('activity')}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="4px"
                      >
                        <ActivitiesIcon />
                      </Box>
                      <Box>Activity</Box>
                    </Box>
                  </Box>
                </Box>
                {tokenBalance && tokenBalance.length && (
                  <Box
                    width="100%"
                    background="white"
                    borderRadius="32px"
                    boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
                    // border="1px solid #EAECF0"
                    position="relative"
                    zIndex="1"
                  >
                    <Box padding="12px 16px" paddingBottom="0">
                      {tokenBalance.map((item: any, index: number) => (
                        <Box key={index} display="flex" alignItems="center" marginBottom="12px">
                          <Box marginRight="10px">
                            <Image src={item.logoURI} w="32px" h="32px" />
                          </Box>
                          <Box fontWeight="500" fontSize="22px" lineHeight="24px" color="#161F36">
                            {item.name}
                          </Box>
                          <Box marginLeft="auto" display="flex" flexDirection="column" alignItems="flex-end">
                            <Box fontWeight="500" fontSize="22px" lineHeight="24px" color="#161F36">
                              {item.tokenBalanceFormatted}
                            </Box>
                            <Box fontSize="12px" lineHeight="15px" color="#95979C">$0</Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                {(!tokenBalance || !tokenBalance.length) && (
                  <Box
                    width="100%"
                    background="white"
                    borderRadius="32px"
                    height="377px"
                    boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
                    // border="1px solid #EAECF0"
                    position="relative"
                    zIndex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      <Box marginBottom="20px">
                        <Image height="108px" src={EmptyIcon} />
                      </Box>
                      <Box fontSize="14px" fontWeight="400" lineHeight="17.5px" color="#676B75">You don’t have any assets yet</Box>
                      <Box marginTop="20px">
                        <Button size="lg" type="white" width="100px" fontSize="17px">Deposit</Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Fragment>
            )}
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
              sm: '32px 32px 0 0',
              md: '32px',
            }}
            maxW={{
              sm: '100vw',
              md: '430px',
            }}
            marginTop={{
              sm: `${innerHeight - 444}px`,
              md: 'calc(50vh - 125px)',
            }}
            height={444}
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
              paddingTop="60px"
            >
              <SettingPage closeModal={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ThemePage>
  );
}
