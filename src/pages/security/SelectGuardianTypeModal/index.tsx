import {
  useCallback
} from 'react'
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import VideoIcon from '@/components/Icons/Video'
import Button from '@/components/Button'
import EOAGuardianIcon from '@/assets/icons/eoa-guardian.svg'
import EmailGuardianIcon from '@/assets/icons/email-guardian.svg'

export default function SelectGuardianTypeModal({
  isOpen,
  openModal,
  closeModal,
}: any) {
  const startIntroGuardian = useCallback(() => {
    console.log('startIntroGuardian')
    closeModal('selectGuardian')
    openModal('introGuardian')
  }, [])

  const startEditGuardian = useCallback(() => {
    console.log('startEditGuardian')
    closeModal('selectGuardian')
    openModal('editGuardian')
  }, [])

  const startAddEmailGuardian = useCallback(() => {
    console.log('startAddEmailGuardian')
    closeModal('selectGuardian')
    openModal('addEmailGuardian')
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={() => closeModal('selectGuardian')} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{base: "95%", lg :"840px"}} my={{base: "120px"}} borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          padding="20px 32px"
        >
          Add guardians
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%">
              <Box width="100%" display="flex" flexWrap="wrap">
                <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  padding="16px"
                  marginBottom="24px"
                  width="100%"
                  cursor="pointer"
                  onClick={startEditGuardian}
                >
                  <Box
                    width="60px"
                    height="60px"
                    borderRadius="60px"
                    marginRight="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="rgba(0, 0, 0, 0.05)"
                  >
                    <Image
                      src={EOAGuardianIcon}
                      width="60px"
                      height="60px"
                    />
                  </Box>
                  <Box width="calc(100% - 60px)">
                    <TextBody fontSize="18px">Ethereum wallet</TextBody>
                    <TextBody type="t2">Use your own or your friends & family's wallet addresses.</TextBody>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  padding="16px"
                  marginBottom="14px"
                  width="100%"
                  cursor="pointer"
                  onClick={startAddEmailGuardian}
                >
                  <Box
                    width="60px"
                    height="60px"
                    borderRadius="60px"
                    marginRight="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="rgba(0, 0, 0, 0.05)"
                  >
                    <Image
                      src={EmailGuardianIcon}
                      width="60px"
                      height="60px"
                    />
                  </Box>
                  <Box width="calc(100% - 60px)">
                    <TextBody fontSize="18px" display="flex" alignItems="center">
                      <Box>Email</Box>
                    </TextBody>
                    <TextBody type="t2">Use email address for wallet recovery.</TextBody>
                    {/* <TextBody type="t2">Use email address for wallet recovery. Powered by <Box as="span" fontWeight="700" textDecoration="underline" onClick={(e: any) => { e.stopPropagation(); window.open('https://github.com/zkemail', '_blank') }}>ZKemail</Box>.</TextBody> */}
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Box
                    fontFamily="Nunito"
                    fontSize="18px"
                    fontWeight="700"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    onClick={startIntroGuardian}
                  >
                    <Box marginRight="8px"><VideoIcon /></Box>
                    <Box>What’s guardian?</Box>
                  </Box>
                  <Box>
                    <Button onClick={startEditGuardian} size="xl">
                      Next
                    </Button>
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
