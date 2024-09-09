import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Box, Image, useDisclosure } from "@chakra-ui/react";
import Button from "../Button";
import QuestionIcon from '@/components/Icons/Question';
import OpIcon from '@/assets/mobile/op.png';

export default function NetWorkDetialModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const modalContentHeight = 468;
    return <>
        {/* trigger */}
        <Box onClick={onOpen} marginTop="8px" display="flex" alignItems="center" cursor="pointer">
            <Box marginRight="8px">
                <Image w="32px" h="32px" src={OpIcon} />
            </Box>
            <Box fontSize="22px" fontWeight="500">
                Optimism
            </Box>
            <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center">
                <QuestionIcon />
            </Box>
        </Box>
        {/* modal */}
        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" blockScrollOnMount>
            <ModalOverlay height="100vh" />
            <ModalContent
                pos='absolute'
                height={`${modalContentHeight}px`}
                overflow="auto"
                mb="0"
                bottom={{
                    base: 0,
                    lg: `calc(50vh - ${modalContentHeight / 2}px)`
                }}
                maxW={{
                    base: '100vw',
                    lg: '430px',
                }}
                borderRadius={{
                    base: '32px 32px 0 0',
                    lg: '32px',
                }}
            >
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" width="100%">
                    <Box background="#D9D9D9" height="96px" width="96px" borderRadius="80px" marginBottom="30px">
                        <Image height="96px" width="96px" src={OpIcon} />
                    </Box>
                    <Box fontSize="28px" fontWeight="500" marginBottom="14px" color="#161F36">
                        Optimism network
                    </Box>
                    <Box fontSize="14px" marginBottom="40px" color="#676B75">
                        Optimism is a Layer-2 scaling network for Ethereum that operates under a four-pillar design philosophy of
                        simplicity, pragmatism, sustainability, and optimism.
                    </Box>
                    <Box width="100%">
                        <Button size="xl" type="black" width="100%" onClick={onClose}>
                            Got it
                        </Button>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}