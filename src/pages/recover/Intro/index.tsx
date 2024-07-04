import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import RecoverIcon from '@/assets/recover.svg'
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import useScreenSize from '@/hooks/useScreenSize'

export default function Intro({ onPrev, onNext }: any) {
  const { innerHeight } = useScreenSize()

  return (
    <Box width="100%" height={innerHeight - 60 - 20} padding="30px" display="flex" alignItems="center" flexDirection="column" justifyContent="center">
      <Box
        width="144px"
        height="144px"
        borderRadius="120px"
        margin="0 auto"
        background="#F2F2F2"
        opacity="0.55"
      >
        <Image height="144px" src={RecoverIcon} />
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="500"
        marginTop="24px"
        color="#161F36"
      >
        Recover my wallet
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="20px"
        color="#676B75"
      >
        We understand it must be annoying to lose wallet.<br />
        No worries, we got you covered!<br />
        Just simply recovery your wallet within <Box as="span" fontWeight="500">3 steps</Box>.
      </Box>
      <Button onClick={onNext} size="xl" type="gradientBlue" width="100%" marginTop="30px">Get started</Button>
      <Button size="xl" type="white" width="100%" onClick={onPrev} marginTop="8px" background="#F6F6F6">Back</Button>
    </Box>
  );
}
