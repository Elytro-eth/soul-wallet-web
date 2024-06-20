import { useState, useCallback, useRef, useEffect } from 'react'
import { Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, Image, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import ProfileIcon from '@/components/Icons/mobile/Profile'
import SettingIcon from '@/components/Icons/mobile/Setting'
import TelegramIcon from '@/components/Icons/mobile/Telegram'
import UserIcon from '@/components/Icons/mobile/User'
import MenuIcon from '@/components/Icons/mobile/Menu'
import CloseIcon from '@/components/Icons/mobile/Close'
import { useAddressStore } from '@/store/address';
import IconSetting from '@/assets/icons/setting.svg';
import Button from '@/components/mobile/Button'
import useWallet from '@/hooks/useWallet';
import AddressIcon from '@/components/AddressIcon';
import Settings from '@/pages/settings'
import Activity from '@/pages/activity'
import Deposit from '@/pages/deposit'
import Withdraw from '@/pages/withdraw'
import Send from '@/pages/send'
import Receive from '@/pages/receive'
import ReceiveSteps from '@/pages/receiveSteps'
import RecoverVerifyEmail from '@/pages/recover/RecoverVerifyEmail'
import Details from '@/pages/dashboard/Details'
import VerifyEmail from '@/pages/verifyEmail'
import AddWalletGuardian from '@/pages/settings/Guardian/AddWalletGuardian'
import AddEmailGuardian from '@/pages/settings/Guardian/AddEmailGuardian'
import useWalletContext from '@/context/hooks/useWalletContext';
import useScreenSize from '@/hooks/useScreenSize'

export function ModalPage({ height, activeModal, openModal, closeModal }: any) {
  const scrollableRef = useRef(null);
  const scrollTop = useRef(0);
  const [startPosition, setStartPosition] = useState(null);

  /* const handleStart = (position: any) => {
   *   setStartPosition(position);
   * };

   * const handleMove = (currentPosition: any) => {
   *   if (startPosition == null) return;

   *   if (startPosition > currentPosition + 20) {
   *     // console.log('Moving up');
   *   } else if (startPosition < currentPosition - 30) {
   *     console.log('Moving down', scrollTop.current);
   *     if (scrollTop.current == 0) {
   *       closeModal()
   *     }
   *   }
   * };

   * const handleTouchStart = (e: any) => {
   *   handleStart(e.touches[0].clientY);
   * };

   * const handleTouchMove = (e: any) => {
   *   handleMove(e.touches[0].clientY);
   * };

   * const handleMouseDown = (e: any) => {
   *   handleStart(e.clientY);
   * };

   * const handleMouseMove = (e: any) => {
   *   if (e.buttons === 1) {
   *     handleMove(e.clientY);
   *   }
   * }; */

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
      return <Details isModal={true} {...props} registerScrollable={registerScrollable} />
    } else if (name === 'deposit') {
      return <Deposit isModal={true} {...props} registerScrollable={registerScrollable} />
    } else if (name === 'withdraw') {
      return <Withdraw isModal={true} {...props} />
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
    } else if (name === 'addEmailGuardian') {
      return <AddEmailGuardian isModal={true} {...props} />
    } else if (name === 'verifyEmail') {
      return <VerifyEmail isModal={true} {...props} />
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
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
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
  const contentHeight = innerHeight - 56
  const marginHeight = innerHeight - 250
  console.log('isModalOpen', isModalOpen)
  console.log('isFullScreenModalOpen', isFullScreenModalOpen)

  const doLogout = async () => {
    logoutWallet();
  }

  const getContentStyles = (isOpen: any) => {
    if (isOpen) {
      return {
        'transform': 'perspective(1300px) translateZ(-80px)',
        'transform-style': 'preserve-3d',
        'border-radius': '20px',
        'overflow': 'hidden'
      }
    }

    return {}
  }

  return (
    <Box background="black">
      <Box
        height={innerHeight}
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
              background={isFullScreenModalOpen ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0)'}
              transition="all 0.3s ease"
            />
            <Box
              height="100%"
              width="100%"
              position="absolute"
              background="white"
              top={isFullScreenModalOpen ? '0' : '100%'}
              transition="all 0.3s ease"
            >
              <Box
                height="32px"
                width="32px"
                borderRadius="30px"
                position="absolute"
                top="20px"
                right="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={closeFullScreenModal}
                zIndex="2"
              >
                <CloseIcon />
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
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          motionPreset="slideInBottom"
          blockScrollOnMount={true}
        >
          <ModalOverlay zIndex="999" />
          <ModalContent
            // onTouchStart={handleTouchStart}
            // onTouchMove={handleTouchMove}
            // onMouseDown={handleMouseDown}
            // onMouseMove={handleMouseMove}
            zIndex="2"
            borderRadius={{
              sm: '20px 20px 0 0',
              // md: '20px',
            }}
            maxW={{
              sm: '100vw',
              md: '430px'
            }}
            marginTop={{
              sm: `40px`,
              // md: 'calc(50vh - 125px)'
            }}
            mb="0"
            height={{
              sm: innerHeight - 40,
              // md: '250px'
            }}
            overflow="auto"
            padding="0"
            boxShadow={"none"}
          >
            <Box tabIndex={0} />
            <ModalCloseButton zIndex="1" marginTop="14px" />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
              width="100%"
              padding="0"
            >
              <ModalPage
                height={innerHeight - 40}
                activeModal={activeModal}
                openModal={openModal}
                closeModal={closeModal}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
