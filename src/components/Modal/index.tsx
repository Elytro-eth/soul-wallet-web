import {
  Modal as CModal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';

export default function Modal({ title, visible, onClose, width, hideClose, children }: any) {
  return (
    visible && (
      <CModal isOpen={visible} isCentered onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: '90%', lg: '640px', ...width }}>
          <ModalHeader px="8" py="5">
            <Text fontWeight={'700'} fontSize={'20px'}>
              {title}
            </Text>
          </ModalHeader>
          {!hideClose && <ModalCloseButton top="15px" />}
          <ModalBody pt="0" pb={{ base: 4 }} px={{ base: 4, lg: 8 }}>
            {children}
          </ModalBody>
        </ModalContent>
      </CModal>
    )
  );
}
