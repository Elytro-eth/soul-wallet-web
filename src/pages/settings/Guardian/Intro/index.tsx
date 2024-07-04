import { useState, useRef } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, useDisclosure, Link, Image, Menu, MenuList, MenuItem, useOutsideClick, MenuButton } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import GuardianIcon from '@/assets/mobile/guardian.svg'
import EmailGuardianIcon from '@/components/Icons/mobile/EmailGuardian';
import WalletGuardianIcon from '@/components/Icons/mobile/WalletGuardian';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import useWalletContext from '@/context/hooks/useWalletContext';
import IntroGuardianIcon from '@/assets/guardian.svg'
import useScreenSize from '@/hooks/useScreenSize'

export default function Intro({ onPrev, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menuRef = useRef<any>()
  const { openModal } = useWalletContext()
  const { innerHeight } = useScreenSize()

  useOutsideClick({
    ref: menuRef,
    handler: () => onClose(),
  })

  return (
    <Box
      width="100%"
      height={innerHeight - 60}
      padding="30px"
      paddingTop="40px"
    >
      <Box
        marginBottom="40px"
        height="116px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image height="116px" src={IntroGuardianIcon} />
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="500"
        color="#161F36"
      >
        What’s recovery contact?
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="18px"
        color="#676B75"
      >
        Recovery contacts are the wallet addresses from your own or trusted friends which will be requested for signature when your wallet is lost. Adding recovery contacts will protect your wallet from potential lose.
      </Box>
      <Box width="100%" display="flex" alignItems="center" justifyContent="center">
        <Box position="relative">
          <Box
            position="absolute"
            top="60px"
            left="calc(-50vw + 32px)"
            width="calc(100vw - 64px)"
          >
            <Menu
              isOpen={isOpen}
              isLazy
              autoSelect={false}
            >
              {() => (
                <Box overflow="auto" ref={menuRef}>
                  <MenuButton width="100%" as={Box} onClick={() => { isOpen ? onClose() : onOpen()}}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Button  size="xl" type="gradientBlue" width="calc(100vw - 64px)" maxWidth="calc(430px - 64px)">Add</Button>
                    </Box>
                  </MenuButton>
                </Box>
              )}
            </Menu>
          </Box>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay height="100vh" background="transparent" />
        <ModalContent
          borderRadius="24px"
          justifyContent="flex-end"
          maxW={{
            sm: 'calc(100vw - 32px)',
            md: '430px',
          }}
          marginTop={{
            sm: `auto`,
            md: 'calc(50vh - 125px)',
          }}
          overflow="visible"
          mb="0"
          bottom="30px"
          position="relative"
          overflowY="scroll"
          boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
        >
          <ModalCloseButton />
          <ModalHeader fontSize="20px" fontWeight="500" color="#161F36" paddingBottom="2">Add recovery contact via...</ModalHeader>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            width="100%"
            paddingLeft="0"
            paddingRight="0"
          >
            <Box
              background="white"
              width="100%"
              padding="0 16px"
            >
              <Box
                width="calc(100%)"
                position="relative"
                padding="0 16px"
                display="flex"
                alignItems="center"
                height="56px"
                background="#F2F3F5"
                borderRadius="16px"
                marginBottom="8px"
                onClick={() => { openModal('addWalletGuardian'); onClose(); }}
              >
                <Box marginRight="8px"><WalletGuardianIcon /></Box>
                <Box fontWeight="500" fontSize="18px" color="#161F36">
                  Wallet
                </Box>
              </Box>
              <Box
                width="calc(100%)"
                position="relative"
                padding="0 16px"
                display="flex"
                alignItems="center"
                height="56px"
                background="#F2F3F5"
                borderRadius="16px"
                marginBottom="8px"
                onClick={() => { openModal('verifyEmail'); onClose(); }}
              >
                <Box marginRight="8px"><EmailGuardianIcon /></Box>
                <Box fontWeight="500" fontSize="18px" color="#161F36">
                  Mail
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
