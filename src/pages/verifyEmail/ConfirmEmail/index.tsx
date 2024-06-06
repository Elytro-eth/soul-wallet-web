import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'

export default function ConfirmEmail({ onNext }: any) {

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Button disabled={false} size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
    </Box>
  );
}
