import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import QuestionIcon from '@/components/Icons/Question';

export default function SetEmail({ value, onPrev, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 508
  console.log('innerHeight', innerHeight)

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box
        fontWeight="600"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="20px"
      >
        Email
      </Box>
      <Box width="100%" marginBottom="10px">
        <Input
          height="40px"
        // value={value}
          spellCheck={false}
        // onChange={e => onChange(e.target.value)}
          fontSize="28px"
          lineHeight="24px"
          padding="0"
          fontWeight="700"
          placeholder="Enter your email"
          borderRadius="0"
          border="none"
          outline="none"
          _focusVisible={{ border: 'none', boxShadow: 'none' }}
        />
        {/* <Box marginTop="10px" width="100%" height="1px" background="rgba(73, 126, 130, 0.2)" /> */}
      </Box>
      <Box color="#E83D26" fontSize="14px" fontWeight="500" width="100%">Please enter a valid email address</Box>
      <Button marginTop="62px" disabled={false} size="xl" type="blue" width="100%" onClick={onNext}>Verify Email</Button>
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginTop="24px"
        onClick={onOpen}
      >
        <Box fontSize="14px" fontWeight="400" color="rgba(0, 0, 0, 0.5)">
          Why do I need to provide Email?
        </Box>
        <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center">
          <QuestionIcon />
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px',
          }}
          marginTop={{
            sm: `${marginHeight}px`,
            md: 'calc(50vh - 125px)',
          }}
          height="508px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <Box fontSize="24px" fontWeight="700" marginTop="40px" marginBottom="14px" textAlign="center" letterSpacing="-1px">
              Why do I need to provide Email
            </Box>
            <Box fontSize="16px" textAlign="center" marginBottom="40px">
              The email will be used as guardian for your Soul Wallet account for recovery.
            </Box>
            <Box
              width="100%"
              height="150px"
              background="rgba(242, 242, 242, 0.55)"
              padding="24px 20px"
            >
              <Box fontSize="14px" width="100%" textAlign="center" fontWeight="500">Email providers we recommend:</Box>
              <Box></Box>
            </Box>
            <Box width="100%" marginTop="40px">
              <Button size="xl" type="blue" width="100%" onClick={onClose}>
                Got it
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
