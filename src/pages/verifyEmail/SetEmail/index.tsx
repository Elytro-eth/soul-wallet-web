import { Box, Text, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import QuestionIcon from '@/components/Icons/Question';
import { validEmailDomains, validEmailProviders } from '@/config/constants'
import useForm from '@/hooks/useForm';
import useScreenSize from '@/hooks/useScreenSize'

export default function SetEmail({ email, onChange, onBlur, errorMsg, disabled, onSendEmail, sendingEmail, isModal }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { innerHeight } = useScreenSize()
  const marginHeight = innerHeight - 458

  return (
    <Box width="100%" padding="48px 30px" height="400px">
      <Box
        fontWeight="500"
        fontSize="28px"
        lineHeight="1"
        marginBottom="20px"
        color="#161F36"
      >
        Email
      </Box>
      <Box width="100%" marginBottom="30px">
        <Input
          // autoFocus
          onChange={(e: any) => onChange((e.target.value).toLowerCase())}
          onBlur={(e: any) => onBlur(e.target.value)}
          value={email}
          height="56px"
          spellCheck={false}
          fontSize="20px"
          lineHeight="24px"
          fontWeight="400"
          placeholder="Enter your email"
          border="none"
          outline="none"
          background="#F2F3F5"
          padding="16px"
          borderRadius="16px"
          color="#161F36"
          marginBottom="8px"
          _focusVisible={{ border: 'none', boxShadow: 'none' }}
        />
        <Box mt="1" h="44px" overflow={"hidden"}>
          {!errorMsg && <Box color="#2D3CBD" fontSize="14px" lineHeight="17.5px" width="100%" onClick={onOpen}>
            Why do I need to provide Email?
          </Box>}
          {errorMsg && <Box color="#E83D26" fontSize="14px" lineHeight="17.5px" width="100%">{errorMsg}</Box>}
        </Box>
      </Box>
      <Button disabled={disabled} size="xl" type="gradientBlue" width="100%" loading={sendingEmail} onClick={onSendEmail}>Continue</Button>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '32px 32px 0 0',
            md: '32px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px',
          }}
          marginTop={{
            sm: `${marginHeight}px`,
            md: 'calc(50vh - 229px)',
          }}
          height="458px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <Box fontSize="28px" fontWeight="500" marginTop="40px" marginBottom="8px" color="#161F36">
              Why do I need to provide Email
            </Box>
            <Box fontSize="14px" fontWeight="400" marginBottom="4px" color="#676B75">
              The email will be used as recovery contact for your Soul Wallet account for recovery. Email providers we recommend:
            </Box>
            <Box
              width="100%"
              // background="rgba(242, 242, 242, 0.55)"
              padding="8px 20px"
              paddingBottom="6px"
            >
              <Box
                display="flex"
                flexWrap="wrap"
                marginTop="16px"
                alignItems="center"
                justifyContent="space-between"
              >
                {validEmailProviders.map((email: any) => (
                  <Box
                    display="flex"
                    key={email.domain}
                    alignItems="center"
                    // marginRight="24px"
                    marginBottom="18px"
                  >
                    <Box
                      minWidth="36px"
                      minHeight="36px"
                      marginRight="8px"
                    >
                      <Image width="36px" height="36px" src={email.icon} />
                    </Box>
                  </Box>
                ))}

              </Box>
            </Box>
            <Box width="100%" marginTop="40px">
              <Button size="xl" type="gradientBlue" width="100%" onClick={onClose}>
                Got it
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
