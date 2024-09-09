import { Box, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import Circle from "../Icons/mobile/Circle";
import IconChevronRight from '@/assets/icons/chevron-right-fee.svg';
import { useBalanceStore } from "@/store/balance";
import { zeroAddress } from 'viem';

export interface FeeSelectModalProps {
    useSponsor: boolean,
    isSent: boolean,
    sponsorLeftTimes: number,
    setUseSponsor: (useSponsor: boolean) => void
}

export default function FeeSelectModal({
    useSponsor,
    isSent,
    sponsorLeftTimes,
    setUseSponsor
}: FeeSelectModalProps) {
    const { getTokenBalance } = useBalanceStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ethBalance = getTokenBalance(zeroAddress);
    const ethItem = {
        type: 'ETH',
        title: 'Pay with ETH',
        subTitle: `Balance: ${ethBalance?.tokenBalanceFormatted || 0} ETH`
    };
    const sponserItem = {
        type: 'sponser',
        title: 'Sponsored by Soul Wallet',
        subTitle: `${sponsorLeftTimes} times left today`
    }
    const selectItems = sponsorLeftTimes > 0 ? [sponserItem, ethItem] : [ethItem];

    const getOpacity = (type: string) => {
        if (type === 'sponser') return useSponsor ? 1 : 0.6;
        return !useSponsor ? 1 : 0.6
    }

    return <>
        <Box marginTop="8px" display="flex" justifyContent="center" flexDirection="column">
            <Flex gap="1" align="center" onClick={() => !isSent && onOpen()} cursor="pointer">
                <Box fontSize="22px" fontWeight="500" lineHeight="24.2px" textDecoration={useSponsor ? 'line-through' : ''}>
                    $0
                </Box>
                {!isSent && <Image src={IconChevronRight} />}
            </Flex>
            {useSponsor && <Box h="32px">
                <Box fontWeight="400" fontSize="12px" color="#2D3CBD">
                    Sponsored by Soul Wallet
                </Box>
            </Box>
            }
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
            <ModalOverlay height="100vh" background="transparent" />
            <ModalContent
                borderRadius="24px"
                justifyContent="flex-end"
                maxW={{
                    base: 'calc(100vw - 32px)',
                }}
                marginTop={{
                    base: `auto`,
                }}
                overflow="visible"
                mb="0"
                bottom="30px"
                position="relative"
                overflowY="scroll"
                boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
                border="1px solid #F2F3F5"
            >
                <ModalCloseButton />
                <ModalHeader fontSize="20px" fontWeight="500" color="#161F36" paddingBottom="2">
                    Fee
                </ModalHeader>
                <ModalBody
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                    width="100%"
                    paddingLeft="0"
                    paddingRight="0"
                >
                    <Box background="white" width="100%" padding="0 16px">
                        {
                            selectItems.map(item => (
                                <Box
                                    key={item.type}
                                    width="100%"
                                    position="relative"
                                    display="flex"
                                    alignItems="center"
                                    height="72px"
                                    background="#F2F3F5"
                                    borderRadius="16px"
                                    marginBottom="8px"
                                    padding="16px"
                                    onClick={() => {
                                        setUseSponsor(item.type === 'sponser');
                                        onClose();
                                    }}
                                    opacity={getOpacity(item.type)}
                                >
                                    <Box
                                        height="24px"
                                        width="24px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        marginRight="8px"
                                    >
                                        <Circle active={item.type === 'sponser' ? useSponsor : !useSponsor} />
                                    </Box>
                                    <Box display="flex" justifyContent="center" flexDirection="column">
                                        <Box fontWeight="500" fontSize="18px" color="#161F36">
                                            {item.title}
                                        </Box>
                                        <Box fontWeight="400" fontSize="12px" color="#161F36">
                                            {item.subTitle}
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        }
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}