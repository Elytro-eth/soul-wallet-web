import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton } from '@chakra-ui/react';

export default function TxModal({ title, visible, onClose, children, width, bodyStyle }: any) {
  return (
    <Modal isOpen={visible} isCentered onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW={width || { base: '95%', lg: '624px' }}>
        {title && (
          <ModalHeader px={{ base: 4, lg: 8 }} py="22px" fontSize={'20px'} fontWeight={'700'}>
            {title}
            <ModalCloseButton top="14px" />
          </ModalHeader>
        )}
        <ModalBody pb={{ base: 2, lg: 6 }} px={{ base: 4, lg: 8 }} {...bodyStyle}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
