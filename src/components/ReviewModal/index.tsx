import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";
import Review, { TransactionType } from "../Review";
import { Address, TransactionRequestBase } from "viem";

interface ReviewModalProps {
    isOpen: boolean,
    sendTo: Address,
    tx?: TransactionRequestBase | null,
    onClose: () => void
    afterTransfer: () => void
}

export default function ReviewModal({
    isOpen,
    sendTo,
    tx,
    onClose,
    afterTransfer
}: ReviewModalProps) {
    return <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount
    >
        <ModalOverlay height="100vh" />
        <ModalContent
            pos='absolute'
            height='100%'
            top={0}
            overflow="hidden"
            borderRadius={{
                sm: '32px 32px 0 0',
                md: '32px',
            }}
            margin={0}
        >
            <ModalCloseButton zIndex={9} />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                width="100%"
                padding={0}
            >
                <Review
                    isModal
                    tx={tx}
                    transactionType={TransactionType.callContract}
                    sendTo={sendTo}
                    actionName="Add New Passkey"
                    afterTransfer={afterTransfer}
                />
            </ModalBody>
        </ModalContent>
    </Modal>
}