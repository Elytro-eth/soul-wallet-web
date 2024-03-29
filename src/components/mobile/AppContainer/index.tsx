import { Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, Image, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import ProfileIcon from '@/components/Icons/mobile/Profile'
import SettingIcon from '@/components/Icons/mobile/Setting'
import TelegramIcon from '@/components/Icons/mobile/Telegram'
import UserIcon from '@/components/Icons/mobile/User'
import MenuIcon from '@/components/Icons/mobile/Menu'
import { useAddressStore } from '@/store/address';
import IconProfile from '@/assets/icons/profile.svg';
import Button from '@/components/mobile/Button'
import useWallet from '@/hooks/useWallet';
import AddressIcon from '@/components/AddressIcon';
import useNavigation from '@/hooks/useNavigation'
import Settings from '@/pages/settings'
import Activity from '@/pages/activity'
import Deposit from '@/pages/deposit'
import Withdraw from '@/pages/withdraw'
import Details from '@/pages/dashboard/Details'

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
        <Box fontSize="16px" lineHeight={"20px"} fontWeight="800">{walletName}</Box>
      </Box>
      <Box fontSize="18px" fontWeight="700" color="black" lineHeight="24px">
        <Box background="white" height="36px" width="36px" borderRadius="36px" display="flex" alignItems="center" justifyContent="center" onClick={openMenu}>
          <Image src={IconProfile} />
        </Box>
      </Box>
    </Box>
  );
}

export default function AppContainer() {
  const { isModalOpen, openModal, closeModal, activeModal } = useNavigation()
  const { logoutWallet } = useWallet();
  const innerHeight = window.innerHeight
  const contentHeight = innerHeight - 56
  const marginHeight = innerHeight - 250
  console.log('isModalOpen', isModalOpen)

  const doLogout = async () => {
    logoutWallet();
  }

  const getContentStyles = (isOpen: any) => {
    if (isOpen) {
      return {
        'transform': 'perspective(1300px) translateZ(-80px)',
        'transform-style': 'preserve-3d',
        'border-radius': '20px'
      }
    }

    return {}
  }

  const renderModal = (name: any) => {
    if (name === 'settings') {
      return <Settings isModal={true} />
    } else if (name === 'activity') {
      return <Activity isModal={true} />
    } else if (name === 'details') {
      return <Details isModal={true} openModal={openModal} />
    } else if (name === 'deposit') {
      return <Deposit isModal={true} closeModal={closeModal} />
    } else if (name === 'withdraw') {
      return <Withdraw isModal={true} closeModal={closeModal} />
    }
  }

  return (
    <Box background="black">
      <Box
        height={innerHeight}
        background="linear-gradient(180deg, #FBFBFB 0%, #F0F0F0 100%)"
        transition="all 0.2s ease"
        sx={getContentStyles(isModalOpen)}
      >
        <Header
          showLogo
          paddingTop="10px"
          paddingBottom="10px"
          height="64px"
          background="transparent"
          openMenu={() => openModal('settings')}
        />
        <Flex
          h={innerHeight - 64}
          flexDir={{ base: 'column', lg: 'row' }}
          gap={{ base: 6, md: 8, lg: '50px' }}
          overflow="auto"
          paddingTop="0"
        >
          <Box w="100%">
            <Outlet context={[openModal]} />
          </Box>
        </Flex>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          motionPreset="slideInBottom"
          blockScrollOnMount={true}
        >
          <ModalOverlay zIndex="999" />
          <ModalContent
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
              {renderModal(activeModal)}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
