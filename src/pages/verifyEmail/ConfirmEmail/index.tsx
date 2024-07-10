import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import useScreenSize from '@/hooks/useScreenSize'
import EmailGuardianIcon from '@/assets/email-guardian.svg'

export default function ConfirmEmail({ onPrev, email, countDown, sendingEmail, onResend, isModal }: any) {
  const { innerHeight } = useScreenSize()

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
      <Box marginBottom="40px" height="116px">
        <Image height="116px" src={EmailGuardianIcon} />
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="24px"
        lineHeight="25px"
        fontWeight="500"
        color="#161F36"
        mb="3"
      >
        Verification sent. <br/>
        Please confirm in your email.
      </Box>
      <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        lineHeight={"17px"}
        color="#3C3F45"
      >
        {email}
      </Box>
      {/* <Box
        width="100%"
        textAlign="center"
        fontSize="14px"
        fontWeight="400"
        marginTop="8px"
        color="#676B75"
      >
        Please follow the instructions and complete the verification process.
      </Box> */}
      <Button disabled={countDown > 0} loading={sendingEmail} size="xl" type="gradientBlue" width="100%" marginTop="40px" onClick={onResend}>
        Resend {countDown > 0 ? `(${countDown}s)` : ''}
      </Button>
      {/* <Button disabled={false} size="xl" type="white" width="100%" onClick={onPrev} marginTop="8px">Use another Email</Button> */}
      {/* <Box height="100px" /> */}
    </Box>
  );
}
