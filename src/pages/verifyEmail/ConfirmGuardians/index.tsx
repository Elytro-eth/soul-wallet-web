import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import useScreenSize from '@/hooks/useScreenSize'

export default function ConfirmGuardians({ onPrev, onChangeGuardian, changingGuardian, isModal }: any) {
  const { innerHeight } = useScreenSize()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Box
      width="100%"
      height={innerHeight - 60}
      padding="30px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="600"
      >
        Confirm update
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="8px"
      >
        Please confirm recovery contact updates on your Soul Wallet account.
      </Box>
      <Button onClick={onChangeGuardian} loading={changingGuardian} size="xl" type="gradientBlue" width="100%" marginTop="30px">Continue</Button>
      <Button size="xl" type="white" width="100%" onClick={onPrev} marginTop="20px">Back</Button>
    </Box>
  );
}
