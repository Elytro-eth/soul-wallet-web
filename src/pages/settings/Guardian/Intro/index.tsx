import { useState, useRef } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image, Menu, MenuList, MenuItem, useOutsideClick, MenuButton } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import GuardianIcon from '@/assets/mobile/guardian.svg'
import EmailGuardianIcon from '@/components/Icons/mobile/EmailGuardian';
import WalletGuardianIcon from '@/components/Icons/mobile/WalletGuardian';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function Intro({ onPrev, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menuRef = useRef<any>()
  const { openModal } = useWalletContext()

  useOutsideClick({
    ref: menuRef,
    handler: () => onClose(),
  })

  return (
    <Box width="100%" height="400px" padding="30px">
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
            >
              {() => (
                <Box overflow="auto" ref={menuRef}>
                  <MenuButton width="100%" as={Box} onClick={() => { isOpen ? onClose() : onOpen()}}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Button  size="xl" type="gradientBlue" width="calc(100vw - 64px)" maxWidth="calc(430px - 64px)">Add recovery contact</Button>
                    </Box>
                  </MenuButton>
                  <MenuList
                    background="white"
                    boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.05)"
                  >
                    <MenuItem
                      width="calc(100vw - 64px)"
                      maxWidth="calc(430px - 64px)"
                      position="relative"
                      padding="18px 27px"
                      borderBottom="1px solid #E4E4E4"
                      onClick={() => { openModal('verifyEmail'); onClose(); }}
                    >
                      <Box fontSize="16px" fontWeight="500" display="flex" alignItems="center">
                        <Box marginRight="8px"><EmailGuardianIcon /></Box>
                        <Box>Email</Box>
                      </Box>
                    </MenuItem>
                    <MenuItem
                      width="calc(100vw - 64px)"
                      maxWidth="calc(430px - 64px)"
                      position="relative"
                      padding="18px 27px"
                      onClick={() => { openModal('addWalletGuardian'); onClose(); }}
                    >
                      <Box fontSize="16px" fontWeight="500" display="flex" alignItems="center">
                        <Box marginRight="8px"><WalletGuardianIcon /></Box>
                        <Box>Wallet</Box>
                      </Box>
                    </MenuItem>
                  </MenuList>
                </Box>
              )}
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
