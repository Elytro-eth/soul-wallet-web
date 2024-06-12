import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'

export default function ConfirmEmail({ onPrev, email, countDown, sendingEmail, onResend }: any) {
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
        fontSize="18px"
        fontWeight="500"
        marginTop="42px"
      >
        A verification email has sent to
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="28px"
        fontWeight="600"
        marginTop="20px"
      >
        {email}
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="20px"
      >
        Please follow the instructions and complete the verification process.
      </Box>
      <Button disabled={countDown > 0} loading={sendingEmail} size="xl" type="blue" width="100%" marginTop="30px" onClick={onResend}>
        Resend {countDown > 0 ? `(${countDown}s)` : ''}
      </Button>
      <Button disabled={false} size="xl" type="white" width="100%" onClick={onPrev} marginTop="20px">Use another Email</Button>
    </Box>
  );
}
