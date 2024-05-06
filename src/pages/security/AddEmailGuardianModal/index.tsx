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
import EditGuardianForm from '../EditGuardianForm'

export default function AddEmailGuardianModal({
  isOpen,
  onClose,
  onConfirm,
  setIsAddEmailGuardianOpen,
  setIsSelectGuardianOpen,
  canGoBack,
  editType
}: any) {
  const onBack = () => {
    setIsAddEmailGuardianOpen(false)
    if (setIsSelectGuardianOpen) setIsSelectGuardianOpen(true)
  }

  const onConfirmLocal = (addresses: any, names: any, i: any) => {
    if (onConfirm) onConfirm(addresses, names, i)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{base: "95%", lg :"840px"}} my={{base: "120px"}} borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalBody
          overflow="auto"
          padding={{ base: "20px 10px", md: "20px 32px" }}
          marginTop={{ base: "30px", md: "60px" }}
        >
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0 20px">
              <Title fontSize="20px" fontWeight="800">Email guardian</Title>
              <TextBody fontWeight="500" marginBottom="31px">
                Use email address as your guardian.
              </TextBody>
              <Box>
                <Box
                  width="100%"
                  position="relative"
                >
                  <Input
                    height="44px"
                    type="text"
                    placeholder="Email address"
                    paddingRight="110px"
                  />
                  {false && (
                    <Box
                      position="absolute"
                      top="0"
                      height="44px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="800"
                      fontFamily="Nunito"
                      color="rgba(0, 0, 0, 0.3)"
                      cursor="pointer"
                      zIndex="1"
                    >
                      Verify email
                    </Box>
                  )}
                  {false && (
                    <Box
                      position="absolute"
                      top="0"
                      height="44px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontFamily="Nunito"
                      color="#FF2E79"
                      cursor="pointer"
                      zIndex="1"
                    >
                      Resend
                    </Box>
                  )}
                  {true && (
                    <Box
                      position="absolute"
                      top="0"
                      height="44px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontFamily="Nunito"
                      color="#0DC800"
                      cursor="pointer"
                      zIndex="1"
                    >
                      <Box marginRight="4px">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M5.74316 9.00014L3.24316 6.17934L2 7.50014L5.74316 11.838L13 3.00014L11.7432 1.67934L5.74316 9.00014Z" fill="#0DC800"/>
                        </svg>
                      </Box>
                      Verified
                    </Box>
                  )}
                </Box>
                <Box
                  width="100%"
                  color="#E83D26"
                  fontWeight="600"
                  fontSize="14px"
                  marginTop="4px"
                  paddingLeft="16px"
                >
                  The email provider is not supported. Please try another
                </Box>
                <Box marginTop="68px" marginBottom="10px" display="flex" justifyContent="flex-end">
                  <Box>
                    <Button type="black" onClick={() => {}} size="xl">Confirm</Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
