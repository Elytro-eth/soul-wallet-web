import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";
import Review, { TransactionType } from "@/components/Review";
import { Address, TransactionRequestBase } from "viem";

interface ReviewModalProps {
    isOpen: boolean,
    sendTo: Address,
    actionName: string,
    tx?: TransactionRequestBase | null,
    onClose: () => void
    afterTransfer?: () => void
}

export default function ReviewModal({
    isOpen,
    sendTo,
    actionName,
    tx,
    onClose,
    afterTransfer
}: ReviewModalProps) {
    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount
        size='xl'
    >
        <ModalOverlay height="100vh" />
        <ModalContent
            pos='absolute'
            top='5vh'
            bottom='5vh'
            width='100%'
            overflow="hidden"
            margin={0}
        >
            <ModalCloseButton zIndex={9} />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                width="100%"
                height='100%'
                overflow="hidden"
                padding={0}
                borderRadius='32px 32px 0 0'
            >
                <Review
                    isModal
                    tx={tx}
                    transactionType={TransactionType.callContract}
                    sendTo={sendTo}
                    actionName={actionName}
                    afterTransfer={afterTransfer}
                    onClose={onClose}
                />
            </ModalBody>
        </ModalContent>
    </Modal>
}