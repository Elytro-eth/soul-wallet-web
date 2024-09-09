import { useEffect, useRef, useState } from 'react';
import {
    Box,
    Image,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import Header from '@/components/mobile/Header';
import SendingIcon from '@/components/Icons/mobile/Sending';
import SentIcon from '@/components/Icons/mobile/Sent';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
import useTools from '@/hooks/useTools';
import useConfig from '@/hooks/useConfig';
import useScreenSize from '@/hooks/useScreenSize';
import FadeId from '@/components/Icons/mobile/FaceId';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import NetWorkDetialModal from '@/components/NetworkDetailModal';
import FeeSelectModal from '@/components/FeeSelectModal';
import { formatEther, TransactionRequestBase } from 'viem';
import ReviewActionIcon from '@/assets/actions/review-action.svg'

interface ReViewProps {
    sendTo: string,
    isModal: boolean,
    transactionType: TransactionType,
    actionName?: string
    selectedToken?: {
        logoURI: string,
        symbol: string,
        decimals: number
    },
    tx?: TransactionRequestBase | null | undefined,
    onPrev?: () => void,
    afterTransfer?: () => void,
    onClose?: () => void
}

export enum TransactionType {
    transfer,
    callContract
}

export default function Review({
    sendTo,
    isModal,
    tx,
    transactionType,
    actionName = 'Action Name',
    selectedToken,
    afterTransfer,
    onPrev,
    onClose,
}: ReViewProps) {
    const { closeModal } = useWalletContext();
    const { chainConfig } = useConfig();
    const { signAndSend, getUserOp } = useWallet();
    const [isSent, setIsSent] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { doCopy } = useTools();
    const [useSponsor, setUseSponsor] = useState(true);
    const executingRef = useRef(false);
    const userOpRef = useRef();
    const isCompletedRef = useRef(false);
    const isTransferingRef = useRef(false);
    const { innerHeight } = useScreenSize();
    const { selectedAddress } = useAddressStore();
    const [sponsorLeftTimes, setSponsorLeftTimes] = useState(0);

    const prepareAction = async () => {
        try {
            if (tx) {
                const _userOp = await getUserOp([tx])
                userOpRef.current = _userOp;
            }
        } catch (e) {
            // user may reach limit of gas sponsor
            executingRef.current = false;
            isTransferingRef.current = false;
            closeModal();
        }
    };

    useEffect(() => {
        prepareAction();
        const interval = setInterval(() => {
            if (isTransferingRef.current || isCompletedRef.current) {
                return;
            }
            prepareAction();
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const onTransfer = async (skipExecutingCheck = false) => {
        setIsSending(true);
        isTransferingRef.current = true;
        if (executingRef.current && !skipExecutingCheck) {
            return;
        }
        executingRef.current = true;
        isTransferingRef.current = true;
        if (userOpRef.current) {
            try {
                const res: any = await signAndSend(userOpRef.current);
                console.log('tx result', res);
                setTxHash(res.transactionHash);
                isTransferingRef.current = false;
                isCompletedRef.current = true;
                setIsSent(true);
                afterTransfer && afterTransfer();
            } catch (e) {
                executingRef.current = false;
                isTransferingRef.current = false;
                isCompletedRef.current = false;
                setIsSending(false);
                onPrev && onPrev();
            }
        } else {
            executingRef.current = false;
            setTimeout(() => {
                onTransfer(true);
            }, 1000);
        }
    };

    const getSponsorLeftTimes = async () => {
        try {
            const res = await api.sponsor.leftTimes({
                chainID: chainConfig.chainIdHex,
                entryPoint: chainConfig.contracts.entryPoint,
                address: selectedAddress,
            });
            setUseSponsor(res.data.sponsorCountLeft > 0);
            setSponsorLeftTimes(res.data.sponsorCountLeft);
        } catch (err) {
            setUseSponsor(false);
            setSponsorLeftTimes(0);
            throw err;
        }
    }
    useEffect(() => {
        getSponsorLeftTimes();
    }, [])

    return (
        <Box width="100%" height={innerHeight}
            overflow="hidden">
            <Header title="" showBackButton={!isModal} onBack={onPrev} />
            <Box
                padding="30px"
                minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}
                paddingTop={{
                    base: '30px',
                    lg: '0',
                }}
            >
                {isSent && (
                    <Box fontSize="28px" fontWeight="500" display="flex" alignItems="center" color="#161F36">
                        <Box marginRight="12px">
                            <SentIcon />
                        </Box>
                        Completed
                    </Box>
                )}
                {isSending && !isSent && (
                    <Box fontSize="28px" fontWeight="500" display="flex" alignItems="center" color="#161F36">
                        <Box marginRight="12px">
                            <SendingIcon />
                        </Box>
                        Sending
                    </Box>
                )}
                {!isSending && !isSent && (
                    <Box fontSize="28px" fontWeight="500" color="#161F36">
                        Review
                    </Box>
                )}
                <Box marginTop="24px">
                    <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C">
                        {transactionType === TransactionType.transfer ? 'Send' : 'Action'}
                    </Box>
                    <Box marginTop="8px" display="flex" alignItems="center">
                        <Box marginRight="8px">
                            {
                                transactionType === TransactionType.transfer ?
                                    <Image w="32px" h="32px" src={selectedToken && selectedToken.logoURI} /> :
                                    <Image w="32px" h="32px" src={ReviewActionIcon} />
                            }
                        </Box>
                        <Box fontSize="22px" fontWeight="500">
                            {
                                transactionType === TransactionType.transfer ?
                                    `${tx?.value ? formatEther(tx.value) : ''} ${selectedToken && selectedToken.symbol}`
                                    : actionName
                            }
                        </Box>
                    </Box>
                </Box>
                <Box marginTop="24px">
                    <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C">
                        {
                            transactionType === TransactionType.transfer ? 'To' : 'Interact with'
                        }
                    </Box>
                    <Box
                        marginTop="8px"
                        alignItems="center"
                        width="100%"
                        display="inline-block"
                        lineHeight="24.2px"
                    >
                        <Box as="span" fontSize="22px" fontWeight={"500"} color="brand.red">
                            {transactionType === TransactionType.transfer ? chainConfig.chainPrefix : 'oeth:'}
                        </Box>
                        <Box as="span" fontSize="22px" color="#161f36" >
                            {sendTo}
                        </Box>
                    </Box>
                </Box>
                <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C" marginTop="24px">
                    Network
                </Box>
                <NetWorkDetialModal />
                <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" color="#95979C" marginTop="24px">
                    Fee
                </Box>
                <FeeSelectModal
                    isSent={isSent}
                    sponsorLeftTimes={sponsorLeftTimes}
                    useSponsor={useSponsor}
                    setUseSponsor={setUseSponsor}
                />
                {isSent && (
                    <Box marginTop="24px" width="100%">
                        <Box width="100%" marginBottom="8px">
                            <Button
                                width="calc(100%)"
                                size="xl"
                                type="gradientBlue"
                                onClick={onClose}
                            >
                                Done
                            </Button>
                        </Box>
                        <Box width="100%">
                            <Button
                                width="calc(100%)"
                                onClick={() => doCopy(`${chainConfig.scanUrl}/tx/${txHash}`)}
                                size="xl"
                                type="white"
                            >
                                Copy transaction link
                            </Button>
                        </Box>
                    </Box>
                )}
                {!isSent && (
                    <Box marginTop="24px" width="100%" display="flex">
                        {!isSending && onPrev && (
                            <Box width="50%" paddingRight="7px">
                                <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">
                                    Back
                                </Button>
                            </Box>
                        )}
                        <Box width={{
                            base: isSending || !onPrev ? '100%' : '50%',
                            lg: '50%'
                        }} paddingLeft="7px">
                            <Button
                                width="calc(100% - 7px)"
                                disabled={isSending}
                                size="xl"
                                type="gradientBlue"
                                onClick={() => onTransfer()}
                            >
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Box marginRight="8px">
                                        <FadeId />
                                    </Box>
                                    <Box>{isSending ? 'Sending' : 'Continue'}</Box>
                                </Box>
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}    
