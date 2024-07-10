import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import useScreenSize from '@/hooks/useScreenSize'
import GuardianIcon from '@/assets/guardian.svg'
import FadeId from '@/components/Icons/mobile/FaceId'

export default function ConfirmGuardians({ onPrev, onChangeGuardian, changingGuardian, isModal }: any) {
  const { innerHeight } = useScreenSize()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Box
      width="100%"
      height={isModal ? (innerHeight - 94) : (innerHeight - 60)}
      padding="30px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box marginBottom="40px" height="120px">
        <Image height="120px" src={GuardianIcon} />
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="500"
        marginTop="8px"
        color="#161F36"
      >
        Confirm recovery contact update
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="8px"
        color="#676B75"
      >
        Please confirm recovery contact updates on your Soul Wallet account.
      </Box>
      <Button onClick={onChangeGuardian} loading={changingGuardian} size="xl" type="gradientBlue" width="100%" marginTop="30px">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box marginRight="8px"><FadeId /></Box>
          <Box>Confirm</Box>
        </Box>
      </Button>
      <Button size="xl" type="white" width="100%" onClick={onPrev} marginTop="8px">Back</Button>
      <Box height="100px" />
    </Box>
  );
}
