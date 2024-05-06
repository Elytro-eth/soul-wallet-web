import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Input
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import Button from '@/components/Button'
import CopyIcon from '@/components/Icons/Copy';
import EditGuardianForm from '../EditGuardianForm'

export default function VerifyEmailGuardianModal({
  isOpen,
  onClose,
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{base: "95%", lg :"609px"}} my={{base: "120px"}} borderRadius="20px">
        <ModalCloseButton top="14px" onClick={onClose} />
        <ModalBody
          overflow="auto"
          padding={{ base: "20px 10px", md: "20px 32px" }}
          marginTop={{ base: "30px", md: "30px" }}

        >
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0 20px">
              <Title
                fontSize="28px"
                fontWeight="700"
                textAlign="center"
                width="100%"
              >
                Verify Email
              </Title>
              <TextBody
                fontSize="16px"
                fontWeight="400"
                marginTop="14px"
                marginBottom="31px"
                textAlign="center"
              >
                Please go to your email and send the following content. This email will be used for approve your recovery request on chain.
              </TextBody>
              <Box
                width="100%"
                border="1px solid rgba(0, 0, 0, 0.05)"
                borderRadius="8px"
                overflow="hidden"
              >
                <Box
                  background="#F2F2F2"
                  padding="10px 24px"
                  fontSize="14px"
                  fontWeight="800"
                >
                  New Message
                </Box>
                <Box
                  padding="10px 24px"
                  fontSize="14px"
                  display="flex"
                  flexDirection="column"
                  width="100%"
                >
                  <Box
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    marginBottom="18px"
                  >
                    <Box width="65px">From</Box>
                    <Box fontWeight="600">******@gmail.com</Box>
                  </Box>
                  <Box
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    marginBottom="18px"
                  >
                    <Box width="65px">To</Box>
                    <Box fontWeight="600" display="flex" alignItems="center">
                      <Box>security@soulwallet.io</Box>
                      <Box marginLeft="4px" cursor="pointer" marginRight="4px" onClick={() => {}}><CopyIcon color="#898989" /></Box>
                    </Box>
                  </Box>
                  <Box
                    width="100%"
                    height="1px"
                    background="rgba(0, 0, 0, 0.05)"
                    marginBottom="18px"
                  />
                  <Box
                    width="100%"
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <Box width="65px" opacity="0.5">Subject</Box>
                    <Box
                      width="calc(100% - 65px)"
                      fontWeight="600"
                      display="flex"
                      alignItems="center"
                    >
                      <Box

                      >{`Please recover my wallet
(0x8d34947d8cba2abd7e8d5b788c8a3674325c93d1, 0x8d34947d8cba2abd7e8d5b788c8a3674325c93d1)`}</Box>
                      <Box marginLeft="4px" cursor="pointer" marginRight="4px" onClick={() => {}}><CopyIcon color="#898989" /></Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginTop="24px"
              >
                <Button size="lg">Send via default email app</Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
