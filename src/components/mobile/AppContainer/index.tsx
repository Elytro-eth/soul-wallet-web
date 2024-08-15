import { useState, useCallback, useRef, useEffect } from 'react'
import { Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, Image, ModalCloseButton, ModalBody, useDisclosure, CloseButton } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useAddressStore } from '@/store/address';
import IconSetting from '@/assets/icons/setting.svg';
import Button from '@/components/mobile/Button'
import useWallet from '@/hooks/useWallet';
import AddressIcon from '@/components/AddressIcon';
import Settings from '@/pages/settings'
import Activity from '@/pages/activity'
import Deposit from '@/pages/deposit'
import Send from '@/pages/send'
import Receive from '@/pages/receive'
import ReceiveSteps from '@/pages/receiveSteps'
import RecoverVerifyEmail from '@/pages/recover/RecoverVerifyEmail'
import Details from '@/pages/dashboard/Details'
import VerifyEmail from '@/pages/verifyEmail'
import Lisence from '@/pages/public/Lisence'
import AddWalletGuardian from '@/pages/settings/Guardian/AddWalletGuardian'
// import AddEmailGuardian from '@/pages/settings/Guardian/AddEmailGuardian'
import useWalletContext from '@/context/hooks/useWalletContext';
import useScreenSize from '@/hooks/useScreenSize'

export function ModalPage({ height, activeModal, openModal, closeModal }: any) {
  const scrollableRef = useRef(null);
  const scrollTop = useRef(0);
  const [startPosition, setStartPosition] = useState(null);

  const handleStart = (position: any) => {
    setStartPosition(position);
  };

  const handleMove = (currentPosition: any) => {
    if (startPosition == null) return;

    if (startPosition > currentPosition + 20) {
      // console.log('Moving up');
    } else if (startPosition < currentPosition - 30) {
      console.log('Moving down', scrollTop.current);
      if (scrollTop.current == 0 && activeModal.name === 'activity') {
        closeModal()
      }
    }
  };

  const handleTouchStart = (e: any) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = (e: any) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: any) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const setScrollableRef = (e: any) => {
    scrollableRef.current = e
  };

  const renderPage = (activeModal: any) => {
    const name = activeModal && activeModal.name
    const props = activeModal && activeModal.props
    console.log('activeModal', activeModal)

    if (name === 'settings') {
      return <Settings isModal={true} {...props} />
    } else if (name === 'activity') {
      return <Activity isModal={true} {...props} registerScrollable={registerScrollable} />
    } else if (name === 'details') {
      return <Details isModal={true} {...props} />
    } else if (name === 'deposit') {
      return <Deposit isModal={true} {...props} />
    } else if (name === 'send') {
      return <Send isModal={true} {...props} />
    } else if (name === 'receive') {
      return <Receive isModal={true} {...props} />
    } else if (name === 'receiveSteps') {
      return <ReceiveSteps isModal={true} {...props} />
    } else if (name === 'recoverVerifyEmail') {
      return <RecoverVerifyEmail isModal={true} {...props} />
    } else if (name === 'addWalletGuardian') {
      return <AddWalletGuardian isModal={true} {...props} />
    } else if (name === 'verifyEmail') {
      return <VerifyEmail isModal={true} {...props} />
    } else if (name === 'verifyEmailGuardian') {
      return <VerifyEmail isModal={true} {...props} />
    } else if (name === 'lisence') {
      return <Lisence isModal={true} {...props} />
    }
  }

  const registerScrollable = (element: any) => {
    const handleScroll = () => {
      scrollTop.current = element.scrollTop
      console.log('handleScroll', scrollTop.current)
    };

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }

  return (
    <Box
      width="100%"
      height={height}
      background="white"
      borderTopRightRadius="32px"
      borderTopLeftRadius="32px"
      borderBottomRightRadius={{
        sm: '0',
        md: '32px',
      }}
      borderBottomLeftRadius={{
        sm: '0',
        md: '32px',
      }}
      overflow="hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      {renderPage(activeModal)}
    </Box>
  )
}

export default function AppContainer() {
  const {
    isModalOpen,
    openModal,
    closeModal,
    activeModal,
    isFullScreenModalOpen,
    openFullScreenModal,
    closeFullScreenModal,
    activeFullScreenModal
  } = useWalletContext()
  const { logoutWallet } = useWallet();
  const { innerHeight } = useScreenSize()
  // const innerHeight = window.innerHeight
  const contentHeight = innerHeight //  - 56
  console.log('isModalOpen', isModalOpen, activeModal)
  console.log('isFullScreenModalOpen', isFullScreenModalOpen)

  const isTransparentBg = activeModal && activeModal.name === 'receive';

  const doLogout = async () => {
    logoutWallet();
  }

  const getContentStyles = (isOpen: any) => {
    if (isOpen) {
      return {}
      return {
        'transform': 'perspective(1300px) translateZ(-80px)',
        'transform-style': 'preserve-3d',
        'border-radius': '20px',
        'overflow': 'hidden'
      }
    }

    return {}
  }

  const desktopModalStyle: any = {
    width: activeModal?.props?.width || 480,
    height: activeModal?.props?.height || 600,
  }

  if (desktopModalStyle.height > innerHeight) desktopModalStyle.height = innerHeight
  desktopModalStyle.top = `calc(50vh - (${desktopModalStyle.height}px / 2))`
  desktopModalStyle.left = `calc(50vw - (${desktopModalStyle.width}px / 2))`

  return (
    <Box background="black">
      <Box
        height={innerHeight}
        // background="#F2F3F5"
        background="white"
        transition="all 0.2s ease"
        sx={getContentStyles(isModalOpen)}
      >
        <Flex
          h={innerHeight}
          flexDir={{ base: 'column', lg: 'row' }}
          gap={{ base: 6, md: 8, lg: '50px' }}
          overflow="auto"
          paddingTop="0"
        >
          <Box w="100%">
            <Outlet context={[openModal]} />
          </Box>
        </Flex>
        <Box
          position="fixed"
          width="100vw"
          height="100vh"
          top="0"
          left="0"
          zIndex="99"
          pointerEvents={isFullScreenModalOpen ? 'all' : 'none'}
        >
          <Box
            height="100%"
            width="100%"
            position="relative"
          >
            <Box
              height="100%"
              width="100%"
              position="absolute"
            // background={isFullScreenModalOpen ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0)'}
              transition="all 0.3s ease"
            />
            <Box
              height="100%"
              width="100%"
              position="absolute"
              // background="white"
              top={isFullScreenModalOpen ? '0' : '100%'}
              transition="all 0.3s ease"
            >
              <Box
                height="32px"
                width="32px"
                borderRadius="30px"
                position="absolute"
                top="12px"
                right="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={closeFullScreenModal}
                zIndex="2"
              >
                <CloseButton />
              </Box>
              <ModalPage
                height={window.innerHeight}
                activeModal={activeFullScreenModal}
                openModal={openFullScreenModal}
                closeModal={closeFullScreenModal}
              />
            </Box>
          </Box>
        </Box>
        <Box
          position="fixed"
          width="100vw"
          height="100vh"
          top="0"
          left="0"
          zIndex="99"
          pointerEvents={isModalOpen ? 'all' : 'none'}
        >
          <Box
            height="100%"
            width="100%"
            position="relative"
          >
            <Box
              height="100%"
              width="100%"
              position="absolute"
              background={isTransparentBg ? 'transparent' : isModalOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'}
              transition="all 0.3s ease"
              onClick={closeModal}
            />
            <Box
              position="absolute"
              transition="all 0.3s ease"
              top={{
                sm: isModalOpen ? '0' : '100%',
                md: isModalOpen ? desktopModalStyle.top : '100%'
              }}
              left={{
                sm: '0',
                md: desktopModalStyle.left
              }}
              height={{
                sm: "100%",
                md: desktopModalStyle.height
              }}
              width={{
                sm: "100%",
                md: desktopModalStyle.width
              }}
            >
              <Box
                height="32px"
                width="32px"
                borderRadius="30px"
                position="absolute"
                top="12px"
                right="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={closeModal}
                zIndex="2"
              >
                <CloseButton />
              </Box>
              <ModalPage
                height={{
                  sm: window.innerHeight,
                  md: desktopModalStyle.height,
                }}
                activeModal={activeModal}
                openModal={openModal}
                closeModal={closeModal}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
