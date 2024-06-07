import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import ChevronDown from '@/components/Icons/mobile/ChevronDown';

export default function ConfirmGuardians({ onPrev, onChangeGuardian }: any) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box
        width="120px"
        height="120px"
        borderRadius="120px"
        margin="0 auto"
      >
        <Image src={EmailIcon} />
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="600"
        marginTop="20px"
      >
        Confirm guardian update
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="20px"
      >
        Please confirm guardian updates on your Soul Wallet account.
      </Box>
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginTop="24px"
        fontWeight="500"
        fontSize="14px"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Box>View details</Box>
        <Box marginLeft="2px" transform={showDetails ? 'rotate(-180deg)' : 'rotate(0deg)'}><ChevronDown /></Box>
      </Box>
      {showDetails && (
        <Box
          background="#F8F8F8"
          borderRadius="20px"
          marginTop="12px"
          padding="12px"
          fontWeight="700x"
          fontSize="12px"
        >
          {`{ "domain": { ... } }`}
        </Box>
      )}
      <Button onClick={onChangeGuardian} size="xl" type="blue" width="100%" marginTop="30px">Continue</Button>
      <Button size="xl" type="white" width="100%" onClick={onPrev} marginTop="20px">Back</Button>
    </Box>
  );
}
