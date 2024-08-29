import { useRef } from 'react'
import { Box, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, useDisclosure, Link, Image, Menu, MenuList, MenuItem, useOutsideClick, MenuButton } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailGuardianIcon from '@/components/Icons/mobile/EmailGuardian';
import WalletGuardianIcon from '@/components/Icons/mobile/WalletGuardian';
import useWalletContext from '@/context/hooks/useWalletContext';
import IntroGuardianIcon from '@/assets/guardian.png'
import useScreenSize from '@/hooks/useScreenSize'

export default function Intro({ onPrev, onNext, isDashboard }: any) {
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
      // height={isDashboard ? (innerHeight - 84) : (innerHeight - 60)} margic number?
      paddingTop="40px"
      background="white"
      display="flex"
      justifyContent="center"
      alignItems={isDashboard ? 'center' : 'flex-start'}
    >
      <Box
        width={isDashboard ? '330px' : '100%'}
        padding={isDashboard ? '0' : '30px'}
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
          Recovery contact
        </Box>
        <Box
          width="100%"
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          marginTop="18px"
          color="#676B75"
        >
          If you lose access to your account, recovery contacts can help you get your account back.
        </Box>
        <Box width="100%" display="flex" alignItems="center" justifyContent="center">
          <Box position="relative">
            <Box
              marginTop="30px"
              marginBottom="20px"
              // position="absolute"
              top="60px"
              left="calc(-50vw + 32px)"
              width={{
                sm: 'calc(100vw - 64px)',
                md: '100%',
              }}
            >
              <Menu
                isOpen={isOpen}
                isLazy
                autoSelect={false}
              >
                {() => (
                  <Box overflow="auto" ref={menuRef}>
                    <MenuButton
                      width={isDashboard ? '330px' : '100%'}
                      margin={isDashboard ? '0 auto' : '0'}
                      as={Box}
                      onClick={() => { isOpen ? onClose() : onOpen() }}
                      cursor="pointer"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          size="xl"
                          type="gradientBlue"
                          width={isDashboard ? '330px' : 'calc(100vw - 64px)'}
                          maxWidth={isDashboard ? '330px' : 'calc(100vw - 64px)'}
                        >
                          Add recovery contact
                        </Button>
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
          <ModalOverlay
            height="100vh"
            background={{
              sm: 'transparent',
              md: 'rgba(0, 0, 0, 0.5)',
            }}
          />
          <ModalContent
            borderRadius="24px"
            justifyContent="flex-end"
            maxW={{
              sm: 'calc(100vw - 32px)',
              md: '330px',
            }}
            marginTop={{
              sm: `auto`,
              md: 'calc(50vh - 100px)',
            }}
            overflow="visible"
            mb="0"
            bottom="30px"
            position="relative"
            overflowY="scroll"
            boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
            border="1px solid #F2F3F5"
          >
            <ModalCloseButton />
            <ModalHeader fontSize="20px" fontWeight="500" color="#161F36" paddingBottom="2">Add via...</ModalHeader>
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
                  onClick={() => { openModal('addWalletGuardian', { width: 640, height: 450 }); onClose(); }}
                  cursor="pointer"
                >
                  <Box marginRight="8px"><WalletGuardianIcon /></Box>
                  <Box fontWeight="500" fontSize="18px" color="#161F36">
                    Wallet address
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
                  onClick={() => { openModal('verifyEmail', { width: 640, height: 420 }); onClose(); }}
                  cursor="pointer"
                >
                  <Box marginRight="8px"><EmailGuardianIcon /></Box>
                  <Box fontWeight="500" fontSize="18px" color="#161F36">
                    Email
                  </Box>
                </Box>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
