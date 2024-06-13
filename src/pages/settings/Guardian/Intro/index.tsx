import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import GuardianIcon from '@/assets/mobile/guardian.svg'
import EmailGuardianIcon from '@/components/Icons/mobile/EmailGuardian';
import WalletGuardianIcon from '@/components/Icons/mobile/WalletGuardian';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';

export default function Intro({ onPrev, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box
        width="120px"
        height="120px"
        borderRadius="120px"
        margin="0 auto"
        background="#F2F2F2"
        opacity="0.55"
      >
        <Image src={GuardianIcon} />
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="24px"
        fontWeight="700"
        marginTop="18px"
      >
        What’s guardian?
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="18px"
      >
        Guardians are the wallet addresses from your own or trusted friends which will be requested for signature when your wallet is lost. Adding guardians will protect your wallet from potential lose.
      </Box>
      <Box width="100%" marginTop="40px" display="flex" alignItems="center" justifyContent="center">
        <Box position="relative">
          <Button onClick={() => { isOpen ? onClose() : onOpen()}} size="xl" type="blue" width="195px">Add guardian</Button>
          <Box
            position="absolute"
            top="60px"
            left="calc(50% - 122px)"
            width="244px"
          >
            <Menu
              isOpen={isOpen}
              isLazy
            >
              {() => (
                <Box overflow="auto">
                  <MenuList
                    background="white"
                    boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.05)"
                  >
                    <MenuItem
                      width="244px"
                      position="relative"
                      padding="18px 27px"
                      borderBottom="1px solid #E4E4E4"
                    >
                      <Box fontSize="16px" fontWeight="500" display="flex" alignItems="center">
                        <Box marginRight="8px"><EmailGuardianIcon /></Box>
                        <Box>Email</Box>
                      </Box>
                    </MenuItem>
                    <MenuItem
                      width="100%"
                      position="relative"
                      padding="18px 27px"
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
