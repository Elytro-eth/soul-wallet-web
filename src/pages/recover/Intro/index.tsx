import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import ChevronDown from '@/components/Icons/mobile/ChevronDown';

export default function ConfirmGuardians({ onPrev, onNext }: any) {
  const [showDetails, setShowDetails] = useState(false)

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
        Recover my wallet
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="20px"
      >
        We understand it must be annoying to lose wallet.<br />
        No worries, we got you covered!<br />
        Just simply recovery your wallet within <Box as="span" fontWeight="700">3 steps</Box>.
      </Box>
      <Button onClick={onNext} size="xl" type="blue" width="100%" marginTop="30px">Get started</Button>
      <Button size="xl" type="white" width="100%" onClick={onPrev} marginTop="20px" background="#F6F6F6">Back</Button>
    </Box>
  );
}
