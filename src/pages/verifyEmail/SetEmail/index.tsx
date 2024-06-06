import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import InputLoading from '@/components/InputLoading';
import { xLink } from '@/config';
import XIcon from '@/assets/x.svg';

export default function SetEmail({ value, onPrev, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 468
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
      <Box width="100%" marginBottom="74px">
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
        <Box marginTop="10px" width="100%" height="1px" background="rgba(73, 126, 130, 0.2)" />
      </Box>
      <Button disabled={false} size="xl" type="blue" width="100%" onClick={onNext}>Verify Email</Button>
    </Box>
  );
}
