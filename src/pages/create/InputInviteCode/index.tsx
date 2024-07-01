import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import InputLoading from '@/components/InputLoading';
import { xLink } from '@/config';
import XIcon from '@/assets/x.svg';
import useScreenSize from '@/hooks/useScreenSize'

export default function InputInviteCode({value, onChange, codeStatus, checking, onNext}: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const disabled = !value || codeStatus !== 0
  const { innerHeight } = useScreenSize()

  console.log('code status', codeStatus);
  const marginHeight = innerHeight - 468
  console.log('innerHeight', innerHeight)


  return (
    <Box width="100%" padding="40px 30px" height="400px">
      <Box
        fontWeight="500"
        fontSize="28px"
        lineHeight="1"
        marginBottom="20px"
        color="#161F36"
      >
        Invite code
      </Box>
      <Box width="100%" marginBottom="30px">
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          height="82px"
          spellCheck={false}
          fontSize="32px"
          autoFocus
          lineHeight="34px"
          fontWeight="500"
          placeholder="Enter or paste here"
          border="none"
          outline="none"
          background="#F2F3F5"
          padding="24px 29px"
          borderRadius="24px"
          color="#161F36"
          marginBottom="8px"
          _focusVisible={{ border: 'none', boxShadow: 'none' }}
        />
        <Box mt="1" h="44px" overflow={"hidden"}>
          {checking ? <InputLoading /> : <>
            {codeStatus === -1 && <Box fontSize="14px" lineHeight="17.5px" color="#2D3CBD" onClick={onOpen}>What if I don’t have one?</Box>}
            {codeStatus === 0 && (
              <Box fontSize="14px" lineHeight="17.5px" color="#0CB700">
                Looks great! Let’s go
              </Box>
            )}
            {(codeStatus === 1 || codeStatus === 2) && (
              <Box fontSize="14px" lineHeight="17.5px" color="#E8424C">
                {codeStatus === 1 ? 'This code has been expired or used. Please try another.' : 'Invalid code, please try another'}
              </Box>
            )}
          </>
          }
        </Box>
      </Box>
      <Button disabled={disabled} size="xl" type="gradientBlue" width="100%" onClick={onNext}>Continue</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '32px 32px 0 0',
            md: '32px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px'
          }}
          marginTop={{
            sm: `${marginHeight}px`,
            md: 'calc(50vh - 125px)'
          }}
          height="468px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box
              background="#D9D9D9"
              height="96px"
              width="96px"
              borderRadius="96px"
              marginBottom="16px"
            >
              <Image src={XIcon} />
            </Box>
            <Box fontSize="28px" fontWeight="500" marginBottom="8px">
              Thanks for your interest
            </Box>
            <Box
              fontSize="14px"
              fontWeight="400"
              lineHeight="17.5px"
              textAlign="center"
              marginBottom="40px"
            >
              We are currently under internal testing. Please be patient and join our Telegram group. We’ll send out more invitations very soon. Thanks again for your patience.
            </Box>
            <Box width="100%">
              <Link target='_blank' href={xLink}>
                <Button size="xl" type="black" width="100%">Follow SoulWallet on X</Button>
              </Link>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
