import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import OpIcon from '@/assets/mobile/op.png'

export default function RecoverSign({ onPrev, onNext }: any) {

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
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="700"
        marginTop="20px"
      >
        Recover request
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="20px"
      >
        Your friend's wallet is lost. As their guardian, please connect your wallet and confirm request to assist with their wallet recovery.
      </Box>
      <Box
        width="100%"
        background="#F8F8F8"
        borderRadius="12px"
        padding="12px"
        marginTop="18px"
      >
        <Box
          color="rgba(0, 0, 0, 0.8)"
          fontSize="12px"
          fontWeight="600"
          display="flex"
          alignItems="center"
          marginBottom="12px"
        >
          <Box>Wallet to recover:</Box>
        </Box>
        <Box
          fontSize="13px"
          fontWeight="600"
        >
          <Box as="span" color="black">0x8d34</Box>
          <Box as="span" color="rgba(0, 0, 0, 0.4)">947d8cba2abd7e8d5b788c8a3674325c93d1</Box>
          <Box as="span" color="black">5c93d1</Box>
        </Box>
        <Box
          borderRadius="4px"
          background="white"
          display="flex"
          width="fit-content"
          padding="4px"
          marginTop="18px"
        >
          <Box marginRight="4px">
            <Image width="20px" height="20px" src={OpIcon} />
          </Box>
          <Box fontWeight="600" fontSize="14px">Optimism</Box>
        </Box>
      </Box>
      <Button size="xl" type="blue" width="100%" marginTop="30px">Connect Wallet</Button>
    </Box>
  );
}
