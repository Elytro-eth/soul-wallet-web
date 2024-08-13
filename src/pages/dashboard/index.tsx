import { useState, useCallback, useRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Image,
  Menu,
  MenuList,
  MenuItem,
  Flex,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useBreakpointValue
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
import USDCIcon from '@/assets/mobile/usdc.png'
import AAVEIcon from '@/assets/mobile/aave.png'
import ThemePage from '@/components/ThemeChange';
import AddressIcon from '@/components/AddressIcon';
import EmptyIcon from '@/assets/mobile/activity-empty.png'
import SettingPage from '@/pages/settings'
import GuardianIntroPage from '@/pages/settings/Guardian/Intro'
import GuardianManagePage from '@/pages/settings/Guardian/Manage'
import ActivityPage from '@/pages/activity'
import useConfig from '@/hooks/useConfig';
import AppHeader from '@/components/mobile/Header';
import AppsIcon2 from '@/components/Icons/desktop/Apps';
import AssetsIcon2 from '@/components/Icons/desktop/Assets';
import ActivityIcon2 from '@/components/Icons/desktop/Activity';
import SettingsIcon2 from '@/components/Icons/desktop/Settings';
import ArrowRightIcon from '@/components/Icons/desktop/ArrowRight';
import op from '@/config/chains/op';
import ImgLogo from '@/assets/soul-logo.svg';
import OpIcon from '@/assets/mobile/op.png'
import { formatDate, toShortAddress, getIconMapping } from '@/lib/tools';
import TokenIcon from '@/components/TokenIcon';
import CopyIcon from '@/components/Icons/mobile/Copy';
import useTools from '@/hooks/useTools';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import LogoutIcon from '@/components/Icons/mobile/Logout'
import useWallet from '@/hooks/useWallet';
import ActivityEmptyIcon from '@/assets/mobile/activity-empty.png';
import TwitterIcon from '@/components/Icons/desktop/Twitter';
import TelegramIcon from '@/components/Icons/desktop/Telegram';
import GithubIcon from '@/components/Icons/desktop/Github';
import LinkedInIcon from '@/components/Icons/desktop/LinkedIn';
import OpenIcon from '@/components/Icons/desktop/Open';
import { thirdPartyLicenseUrl } from '@/config/constants';
import config from '@/config';

const getSubject = (functionName: any) => {
  if (functionName === 'Send') {
    return "To:"
  } else if (functionName === 'Receive') {
    return "From:"
  } else {
    return "On:"
  }
}

const shouldShowAmount = (functionName: any) => {
  if (functionName === 'Send') {
    return true
  } else if (functionName === 'Receive') {
    return true
  } else {
    return false
  }
}

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
  const { logoutWallet } = useWallet();
  const { openFullScreenModal } = useWalletContext();
  const [openModal] = useOutletContext<any>();
  const { navigate } = useBrowser();

  const { doCopy } = useTools();
  const { isOpen: isTransferOpen, onOpen: onTransferOpen, onClose: onTransferClose } = useDisclosure();
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();

  const copyAddress = () => {
    doCopy(selectedAddress)
  }

  const transferMenuRef = useRef();
  const transferInputRef = useRef();

  const setTransferMenuRef = (value: any) => {
    transferMenuRef.current = value;
  };

  const setTransferInputRef = (value: any) => {
    transferInputRef.current = value;
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (transferInputRef.current && !(transferInputRef.current as any).contains(event.target) && transferMenuRef.current && !(transferMenuRef.current as any).contains(event.target)) {
        onTransferClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutMenuRef = useRef();
  const logoutInputRef = useRef();

  const setLogoutMenuRef = (value: any) => {
    logoutMenuRef.current = value;
  };

  const setLogoutInputRef = (value: any) => {
    logoutInputRef.current = value;
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (logoutInputRef.current && !(logoutInputRef.current as any).contains(event.target) && logoutMenuRef.current && !(logoutMenuRef.current as any).contains(event.target)) {
        onLogoutClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <Box
        display={{
          sm: 'none',
          md: 'flex',
        }}
        cursor="pointer"
        onClick={() => navigate('/landing')}
      >
        <Image src={ImgLogo} />
      </Box>
      <Box
        display={{
          sm: 'flex',
          md: 'none',
        }}
        gap="2"
        alignItems="center"
        justifyContent="center"
      >
        <Image src={chainConfig.icon} width="40px" height="40px" />
        <Box fontSize="20px" lineHeight="24px" fontWeight="400" color="#161F36">
          {walletName}
        </Box>
      </Box>
      <Box
        fontSize="18px"
        fontWeight="500"
        color="black"
        lineHeight="24px"
        display="flex"
        alignItems="center"
      >
        <Box
          height="42px"
          borderRadius="22px"
          padding="10px 12px"
          paddingLeft="18px"
          background="rgba(255, 255, 255, 1)"
          display={{
            sm: "none",
            md: "flex"
          }}
          cursor="pointer"
          marginRight="12px"
          onClick={() => { isTransferOpen ? onTransferClose() : onTransferOpen() }}
          position="relative"
        >
          <Box display="flex" alignItems="center" justifyContent="center" ref={setTransferInputRef}>
            <Box fontWeight="500" fontSize="14px" marginRight="4px" color="#161F36">Transfer</Box>
            <Box><ChevronDown /></Box>
          </Box>
          <Box
            position="absolute"
            top="48px"
            right="224px"
            zIndex="2"
          >
            <Menu
              isOpen={isTransferOpen}
              isLazy
            >
              {() => (
                <Box
                  width="100%"
                  overflow="auto"
                  ref={setTransferMenuRef}
                >
                  <MenuList
                    background="white"
                    boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
                    border="1px solid #F2F3F5"
                    width="224px"
                    borderRadius="24px"
                    padding="8px"
                  >
                    <Box
                      width="100%"
                      position="relative"
                      padding="0 8px"
                      onClick={() => {
                        onTransferClose()
                        openFullScreenModal('send')
                      }}
                      display="flex"
                      alignItems="center"
                      height="48px"
                      borderRadius="48px"
                      transition="all 0.2s ease"
                      _hover={{
                        background: '#F2F3F5'
                      }}
                    >
                      <Box>
                        <Image w="8" h="8" mr="8px" flex="0 0 32px" src={getIconMapping('transfer eth')} />
                      </Box>
                      <Box fontSize="18px" fontWeight="500">Send</Box>
                    </Box>
                    <Box
                      width="100%"
                      position="relative"
                      padding="0 8px"
                      onClick={() => {
                        onTransferClose()
                        openModal('receive', { width: 480, height: 600 })
                      }}
                      display="flex"
                      alignItems="center"
                      height="48px"
                      borderRadius="48px"
                      transition="all 0.2s ease"
                      _hover={{
                        background: '#F2F3F5'
                      }}
                    >
                      <Box>
                        <Image w="8" h="8" mr="8px" flex="0 0 32px" src={getIconMapping('receive')} />
                      </Box>
                      <Box fontSize="18px" fontWeight="500">Receive</Box>
                    </Box>
                  </MenuList>
                </Box>
              )}
            </Menu>
          </Box>
        </Box>

        <Box
          height="42px"
          borderRadius="22px"
          padding="10px 12px"
          background="rgba(255, 255, 255, 0.5)"
          display={{
            sm: "none",
            md: "flex"
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box marginRight="8px">
              <Image width="20px" height="20px" src={OpIcon} />
            </Box>
            <Box fontWeight="500" fontSize="14px" marginRight="4px" color="#161F36">{walletName}</Box>
            <Box fontWeight="400" fontSize="14px">({toShortAddress(selectedAddress)})</Box>
            <Box marginLeft="4px" cursor="pointer" onClick={copyAddress}>
              <CopyIcon color="#161F36" />
            </Box>
            <Box width="1px" height="20px" background="#BDC0C7" marginLeft="10px" marginRight="10px"></Box>
            <Box
              cursor="pointer"
              onClick={() => { isLogoutOpen ? onLogoutClose() : onLogoutOpen() }}
              ref={setLogoutInputRef}
            >
              <ChevronDown />
            </Box>
          </Box>
          <Box
            position="absolute"
            top="60px"
            right="240px"
            zIndex="2"
          >
            <Menu
              isOpen={isLogoutOpen}
              isLazy
            >
              {() => (
                <Box
                  width="100%"
                  overflow="auto"
                  ref={setLogoutMenuRef}
                >
                  <MenuList
                    background="white"
                    boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
                    border="1px solid #F2F3F5"
                    width="224px"
                    borderRadius="24px"
                    padding="8px"
                  >
                    <Box
                      width="100%"
                      position="relative"
                      padding="0 8px"
                      onClick={() => {
                        onLogoutClose();
                        logoutWallet();
                      }}
                      display="flex"
                      alignItems="center"
                      height="48px"
                      borderRadius="48px"
                      transition="all 0.2s ease"
                      cursor="pointer"
                      _hover={{
                        background: '#F2F3F5'
                      }}
                    >
                      <Box marginRight="4px">
                        <LogoutIcon />
                      </Box>
                      <Box fontSize="18px" fontWeight="500">Logout</Box>
                    </Box>
                  </MenuList>
                </Box>
              )}
            </Menu>
          </Box>
        </Box>

        <Box
          height="36px"
          width="36px"
          borderRadius="36px"
          alignItems="center"
          justifyContent="center"
          onClick={openMenu}
          display={{
            sm: "flex",
            md: "none"
          }}
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

export function AssetPage({ isDashboard, setActiveMenu }: any) {
  const { openFullScreenModal } = useWalletContext();
  const { innerHeight } = useScreenSize();
  const [modalMargin, setModalMargin] = useState(494);
  const [modalHeight, setModalHeight] = useState(innerHeight - 494);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [modalPosition, setModalPosition] = useState('bottom');
  const toast = useToast();
  const { navigate } = useBrowser();
  const { walletName } = useAddressStore();
  const [openModal] = useOutletContext<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { guardiansInfo } = useGuardianStore();
  const { totalUsdValue, tokenBalance } = useBalanceStore();
  const { historyList } = useHistoryStore();

  const valueLeft = totalUsdValue.split('.')[0];
  const valueRight = totalUsdValue.split('.')[1];

  const fontSize = getFontSize(valueLeft);
  // const smFontSize = getSmallFontSize(valueRight);
  // const fontBottomMargin = getFontBottomMargin(valueLeft);

  const tokenBalanceValid = tokenBalance && tokenBalance.length && tokenBalance.some((item) => BN(item.tokenBalance).isGreaterThan(0));
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
    >
      {(guardiansInfo && guardiansInfo.guardianHash && guardiansInfo.guardianHash === ZeroHash) && (
        <Box
          paddingLeft={{
            sm: '8px',
            md: '0',
          }}
          paddingRight={{
            sm: '8px',
            md: '0',
          }}
          marginBottom="20px"
        >
          <Box
            display="flex"
            alignItems="center"
            width={{
              sm: '100%',
              md: 'fit-content',
            }}
            minHeight={{
              sm: '79px',
              md: '48px',
            }}
            borderRadius="32px"
            // background="white"
            padding="12px 16px"
            color="#0E1736"
            justifyContent="space-between"
            flexDirection={{
              sm: 'row',
              md: 'row-reverse',
            }}
            background={{
              sm: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
              md: 'white',
            }}
            // onClick={() => navigate('/verify-email')}
            onClick={useBreakpointValue({
              sm: () => navigate('/verify-email'),
              md: () => openModal('verifyEmail', { width: 640, height: 420 }),
            })}
            cursor="pointer"
          >
            <Box>
              <Box
                fontSize="32px"
                lineHeight={"1"}
                fontWeight="500"
                display={{
                  sm: 'flex',
                  md: 'none'
                }}
              >
                $10
              </Box>
              <Box
                fontSize={{
                  sm: '14px',
                  md: '18px',
                }}
                lineHeight={{
                  sm: '17px',
                  md: '22.5px',
                }}
                fontWeight={{
                  sm: '400',
                  md: '500',
                }}
                opacity={{
                  sm: '0.64',
                  md: '1',
                }}
                color="#161F36"
                display="flex"
                alignItems="center"
              >
                Setup email recovery to get 10 USDC
                <Box
                  marginLeft="10px"
                  display={{
                    sm: 'none',
                    md: 'flex',
                  }}
                >
                  <ArrowRightIcon />
                </Box>
              </Box>
            </Box>
            <Box>
              <Image
                width={{
                  sm: '40px',
                  md: '32px'
                }}
                height={{
                  sm: '40px',
                  md: '32px'
                }}
                marginRight={{
                  sm: '0px',
                  md: '10px'
                }}
                src={USDCIcon}
              />
            </Box>
          </Box>
        </Box>
      )}
      {/* {activeMenu === 'apps' && (
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
          )} */}
      <Box
        display="flex"
        width="100%"
        flexDirection={{
          sm: 'column',
          md: 'row'
        }}
        height={{
          sm: 'auto',
          md: 'calc(100%)'
        }}
      >
        <Box
          width={{
            sm: '100%',
            md: '56%'
          }}
        >
          <Box
            width="100%"
            padding={{
              sm: '0 8px',
              md: '32px',
            }}
            background={{
              sm: 'transparent',
              md: 'white'
            }}
            borderRadius={{
              sm: '0',
              md: '32px'
            }}
            marginBottom={{
              sm: '0',
              md: '20px'
            }}
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
            background="white"
            borderRadius="32px"
            // boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
            // border="1px solid #EAECF0"
            position="relative"
            zIndex="1"
            paddingBottom={{
              sm: '0',
              md: '4px'
            }}
            display={{
              sm: 'none',
              md: 'flex'
            }}
            height="calc(100% - 140px)"
            flexDirection="column"
          >
            <Box
              fontSize="22px"
              fontWeight="500"
              color="#161F36"
              padding="22px 32px"
              display={{
                sm: 'none',
                md: 'flex'
              }}
              alignItems="center"
              justifyContent="span-between"
              width="100%"
            >
              <Box>
                Activity
              </Box>
              <Box color="#676B75" cursor="pointer" fontWeight="500" fontSize="14px" marginLeft="auto" onClick={() => setActiveMenu('activities') }>
                View more
              </Box>
            </Box>
            <Box
              width="100%"
              // background="white"
              overflow="auto"
              paddingLeft="30px"
              paddingRight="30px"
              height="100%"
            >
              {historyList.length ? (
                <Flex gap="16px" padding="0" flexDir="column" width="100%" paddingBottom="16px">
                  {historyList.slice(0, 5).map((item, index) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      height={{
                        sm: '52px',
                        // md: '42px',
                      }}
                      key={index}
                      width="100%"
                    >
                      <Image w="8" h="8" mr="10px" flex={"0 0 32px"} src={getIconMapping(item.functionName)} />
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        width="calc(100% - 42px)"
                        flexDirection={{
                          sm: 'column',
                          md: 'row',
                        }}
                        justifyContent={{
                          sm: 'center',
                          md: 'space-between',
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36">
                            {item.functionName}
                          </Box>
                          {(shouldShowAmount(item.functionName)) && (
                            <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36" marginLeft="4px">
                              <Box>
                                {item.tokenChanged}
                              </Box>
                              {item.toInfo && <Image ml="1" width="20px" height="20px" src={item.toInfo.logoURI} />}
                            </Box>
                          )}
                        </Box>
                        <Box fontSize="12px" fontWeight="400" lineHeight="15px" color="#95979C" marginTop="2px" display="flex" alignItems="center">
                          {getSubject(item.functionName)}{toShortAddress(item.interactAddress, 6)}
                          <Box
                            marginLeft="8px"
                            cursor="pointer"
                            display={{
                              sm: 'none',
                              md: 'block'
                            }}
                          >
                            <OpenIcon />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Flex>
              ) : (
                <Flex
                  gap="16px"
                  padding="0"
                  width="100%"
                  paddingBottom="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                    <Image src={ActivityEmptyIcon} w={'216px'} h="108px" />
                    <Box color="#676B75" marginTop="8px">
                      You don’t have any activity yet
                    </Box>
                  </Box>
                </Flex>
              )}
            </Box>
          </Box>

          <Box
            width="100%"
            paddingLeft="8px"
            paddingRight="8px"
            marginTop="14px"
            marginBottom="40px"
            display={{
              sm: 'flex',
              md: 'none'
            }}
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
                onClick={() => {
                  openModal('receive', { width: 480, height: 600 })
                }}
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
        </Box>
        <Box
          width={{
            sm: '100%',
            md: '44%'
          }}
          paddingLeft={{
            sm: '0',
            md: '20px',
          }}
        >
          {tokenBalanceValid ? (
            <Box
              width="100%"
              background="white"
              borderRadius="32px"
              // boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
              // border="1px solid #EAECF0"
              position="relative"
              zIndex="1"
              paddingBottom={{
                sm: '0',
                md: '4px'
              }}
              height="100%"
            >
              <Box
                fontSize="22px"
                fontWeight="500"
                color="#161F36"
                padding="22px 32px"
                paddingBottom="0"
                display={{
                  sm: 'none',
                  md: 'flex'
                }}
              >
                Tokens
              </Box>
              <Box
                padding={{
                  sm: '12px 16px',
                  md: '12px 32px'
                }}
                paddingBottom="0"
                display="flex"
                width="100%"
                flexDirection="column"
              >
                {tokenBalance.map((item: any, index: number) => (
                  <Box key={index} display="flex" alignItems="center" marginBottom="12px" width="100%">
                    <Box marginRight="10px">
                      <TokenIcon address={item.contractAddress} size={32} />
                      {/* <Image src={item.logoURI} w="32px" h="32px" /> */}
                    </Box>
                    <Box fontWeight="500" fontSize="22px" lineHeight="24px" color="#161F36">
                      {item.symbol}
                    </Box>
                    <Box marginLeft="auto" display="flex" flexDirection="column" alignItems="flex-end">
                      <Box fontWeight="500" fontSize="22px" lineHeight="24px" color="#161F36">
                        {item.tokenBalanceFormatted}
                      </Box>
                      <Box fontSize="12px" lineHeight="15px" color="#95979C">${item.usdValue || '0'}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : <Box
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
                marginBottom="40px"
              >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Box marginBottom="20px">
                <Image height="108px" w="216px" src={EmptyIcon} />
              </Box>
              <Box fontSize="18px" fontWeight="400" lineHeight="22.5px" color="#676B75">Deposit your first token to start</Box>
              <Box marginTop="12px">
                <Button size="lg" type="white" width="100px" fontSize="17px" onClick={() => openModal('receive', { width: 480, height: 600 })}>Deposit</Button>
              </Box>
            </Box>
          </Box>}
        </Box>
      </Box>
    </Box>
  )
}

export function GuardianPage({ isDashboard }: any) {
  const { guardiansInfo } = useGuardianStore();

  if(!guardiansInfo || !guardiansInfo.guardianHash || guardiansInfo.guardianHash === ZeroHash || true){
    return (
      <GuardianIntroPage isDashboard={isDashboard} />
    )
  } else {
    return (
      <GuardianManagePage isDashboard={isDashboard} />
    )
  }
}

export default function Dashboard(props: any) {
  const { selectedAddress } = useAddressStore();
  const { innerHeight } = useScreenSize();
  const { navigate } = useBrowser();
  const [activeMenu, setActiveMenu] = useState(props.activeMenu || 'assets')
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(()=>{
    if(!selectedAddress){
      navigate('/landing')
    }
  }, [selectedAddress])

  return (
    <ThemePage themeColor="#F2F3F5">
      <Box
        height={innerHeight}
        background={{
          sm: `#F2F3F5`,
          md: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
        }}
      >
        <Header
          paddingTop="10px"
          paddingBottom="10px"
          height="64px"
          background="transparent"
          openMenu={onOpen}
        />
        {/* <Box
            position="fixed"
            width="100vw"
            bottom="30px"
            left="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="2"
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
            </Box> */}
        <Box
          display="flex"
          height={innerHeight - 64}
        >
          <Box
            minWidth={{
              sm: '0',
              md: '240px'
            }}
            height="100%"
            display={{
              sm: 'none',
              md: 'flex'
            }}
            padding="24px 0"
            flexDirection="column"
          >
            <Box width="100%">
              <Box
                width="100%"
                padding="12px 20px"
                cursor="pointer"
                display="flex"
                alignItems="center"
                onClick={() => setActiveMenu('assets')}
              >
                <Box marginRight="8px">
                  <AssetsIcon2 color={activeMenu === 'assets' ? '#2D3CBD' : '#676B75'} />
                </Box>
                <Box
                  fontSize="18px"
                  fontWeight={activeMenu === 'assets' ? '500' : '400'}
                  color={activeMenu === 'assets' ? '#2D3CBD' : '#676B75'}
                  lineHeight="22.5px"
                >
                  Assets
                </Box>
              </Box>
              <Box
                width="100%"
                padding="12px 20px"
                cursor="pointer"
                display="flex"
                alignItems="center"
                onClick={() => setActiveMenu('activities')}
              >
                <Box marginRight="8px">
                  <ActivityIcon2 color={activeMenu === 'activities' ? '#2D3CBD' : '#676B75'} />
                </Box>
                <Box
                  fontSize="18px"
                  fontWeight={activeMenu === 'activities' ? '500' : '400'}
                  color={activeMenu === 'activities' ? '#2D3CBD' : '#676B75'}
                  lineHeight="22.5px"
                >
                  Activity
                </Box>
              </Box>
              <Box
                width="100%"
                padding="12px 20px"
                cursor="pointer"
                display="flex"
                alignItems="center"
                onClick={() => setActiveMenu('settings')}
              >
                <Box marginRight="8px">
                  <SettingsIcon2  color={activeMenu === 'settings' ? '#2D3CBD' : '#676B75'} />
                </Box>
                <Box
                  fontSize="18px"
                  fontWeight={activeMenu === 'settings' ? '500' : '400'}
                  color={activeMenu === 'settings' ? '#2D3CBD' : '#676B75'}
                  lineHeight="22.5px"
                >
                  Settings
                </Box>
              </Box>
            </Box>
            <Box
              marginTop="auto"
            >
              <Box color="#676B75" fontSize="12px" lineHeight="15px" fontWeight="400" paddingLeft="20px" paddingRight="20px" paddingBottom="12px">Version: Alpha 0.0.1</Box>
              <a href={thirdPartyLicenseUrl} target='_blank'>
                <Text color="#676B75" fontSize="12px" lineHeight="15px" fontWeight="400" paddingLeft="20px" paddingRight="20px" paddingBottom="16px">Third-party software license</Text>
              </a>

              <Box
                alignItems="center"
                justifyContent="flex-start"
                gap="17px"
                width="100%"
                display={{
                  sm: 'none',
                  md: 'flex'
                }}
                padding="0 20px"
              >
                {config.socials.map((item, index) => (
                  <a href={item.link} target='_blank'>
                    <Image src={item.icon} key={index} />
                  </a>
                ))}
                {/* <Box
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
                    </Box> */}
              </Box>
            </Box>
          </Box>
          <Box
            width={{
              sm: '100%',
              md: 'calc(100% - 240px)'
            }}
            paddingRight={{
              sm: '0',
              md: '20px'
            }}
            marginBottom={{
              sm: '0',
              md: '20px'
            }}
          >
            <Box
              padding={{
                sm: (activeMenu === 'assets') ? '8px' : '0',
                md: '0'
              }}
              height="100%"
              overflowY="scroll"
              borderRadius={{
                sm: '0',
                md: '32px',
              }}
              background={{
                sm: (activeMenu === 'assets') ? 'transparent' : 'white',
                md: (activeMenu === 'assets') ? 'transparent' : 'white'
              }}
            >
              {activeMenu === 'assets' && <AssetPage isDashboard={true} setActiveMenu={setActiveMenu} />}
              {activeMenu === 'activities' && <ActivityPage isDashboard={true} />}
              {activeMenu === 'settings' && <GuardianPage isDashboard={true} />}
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
              sm: '32px 32px 0 0',
              md: '32px',
            }}
            maxW={{
              sm: '100vw',
              md: '430px',
            }}
            marginTop={{
              sm: `${innerHeight - 474}px`,
              md: 'calc(50vh - 237px)',
            }}
            height={474}
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
