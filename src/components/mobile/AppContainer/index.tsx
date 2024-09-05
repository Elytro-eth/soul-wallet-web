import { useState, useCallback, useRef, useEffect } from 'react'
import { Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, Image, ModalCloseButton, ModalBody, useDisclosure, CloseButton } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useAddressStore } from '@/store/address';
import IconSetting from '@/assets/icons/setting.svg';
import Button from '@/components/mobile/Button'
import useWallet from '@/hooks/useWallet';
import AddressIcon from '@/components/AddressIcon';
import Settings from '@/pages/settings/SettingsMenu.tsx'
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

export function GlobalModal({
  isOpen,
  activeModal,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
  activeModal?: any
}) {
  if (!activeModal) return null;
  const name = activeModal && activeModal.name
  const props = activeModal && activeModal.props
  const style = activeModal && activeModal.style
  const extraStyle = Object.assign({ ...style })
  const renderPage = () => {
    if (name === 'settings') {
      return <Settings isModal {...props} />
    } else if (name === 'activity') {
      return <Activity isModal {...props} />
    } else if (name === 'details') {
      return <Details isModal {...props} />
    } else if (name === 'deposit') {
      return <Deposit isModal {...props} />
    } else if (name === 'send') {
      return <Send isModal {...props} />
    } else if (name === 'receive') {
      return <Receive isModal {...props} />
    } else if (name === 'receiveSteps') {
      return <ReceiveSteps isModal {...props} />
    } else if (name === 'recoverVerifyEmail') {
      return <RecoverVerifyEmail isModal {...props} />
    } else if (name === 'addWalletGuardian') {
      return <AddWalletGuardian isModal {...props} />
    } else if (name === 'verifyEmail') {
      return <VerifyEmail isModal {...props} />
    } else if (name === 'verifyEmailGuardian') {
      return <VerifyEmail isModal {...props} />
    } else if (name === 'lisence') {
      return <Lisence isModal {...props} />
    }
  }

  return (<Modal
    isOpen={isOpen}
    onClose={onClose}
    motionPreset="slideInBottom"
    blockScrollOnMount
    size={props && props?.size ? props.size : 'xl'}
    isCentered
  >
    <ModalOverlay height="100vh" />
    <ModalContent
      width='100%'
      overflow="hidden"
      {...extraStyle}
    >
      <ModalCloseButton zIndex={9} />
      <ModalBody
        display="flex"
        overflow="hidden"
        padding={0}
      >
        {renderPage()}
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}

export default function AppContainer({ children }: any) {
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
  const { innerHeight } = useScreenSize()

  const isTransparentBg = activeModal && activeModal.name === 'receive';
  console.log({ activeModal, closeModal })

  return (
    <Box background="black">
      <Box
        height={innerHeight}
        background="white"
        transition="all 0.2s ease"
      >
        <Flex
          h={innerHeight}
          flexDir={{ base: 'column', lg: 'row' }}
          gap={{ base: 6, lg: 8 }}
          overflow="auto"
          paddingTop="0"
        >
          <Box w="100%">
            {children}
          </Box>
        </Flex>
      </Box>
      <GlobalModal isOpen={!!activeModal} activeModal={activeModal} onClose={closeModal} />
    </Box>
  );
}
