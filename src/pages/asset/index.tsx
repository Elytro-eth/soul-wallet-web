import {
    Box,
    Image,
    Flex,
    useMediaQuery,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import SendIcon from '@/components/Icons/mobile/Send2';
import ReceiveIcon from '@/components/Icons/mobile/Receive2';
import ActivitiesIcon from '@/components/Icons/mobile/Activities';
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import BN from 'bignumber.js';
import { useOutletContext } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';
import { useGuardianStore } from '@/store/guardian';
import { ZeroHash } from 'ethers';
import USDCIcon from '@/assets/mobile/usdc.png'
import EmptyIcon from '@/assets/mobile/activity-empty.png'
import ArrowRightIcon from '@/components/Icons/desktop/ArrowRight';
import { toShortAddress, getIconMapping } from '@/lib/tools';
import TokenIcon from '@/components/TokenIcon';
import ActivityEmptyIcon from '@/assets/mobile/activity-empty.png';
import OpenIcon from '@/components/Icons/desktop/Open';
import useConfig from '@/hooks/useConfig';

const getFontSize = (value: any) => {
    const length = value ? String(value).length : 0;

    if (length > 9) {
        return '24px';
    } else if (length > 7) {
        return '36px';
    } else if (length > 5) {
        return '40px';
    } else if (length > 3) {
        return '50px';
    }

    return '56px';
};

const shouldShowAmount = (functionName: any) => {
    if (functionName === 'Send' || functionName === 'Receive' || functionName.indexOf('Transfer') !== -1) {
        return true
    } else {
        return false
    }
}

const getSubject = (functionName: any) => {
    if (functionName === 'Send') {
        return "To:"
    } else if (functionName === 'Receive') {
        return "From:"
    } else {
        return "On:"
    }
}

const getActivityName = (functionName: any) => {
    if (functionName === 'Transfer ETH') {
        return 'Transfer'
    }

    return functionName
}

export function AssetPage({ setActiveMenu }: any) {
    const { openFullScreenModal } = useWalletContext();
    const { navigate } = useBrowser();
    const [openModal] = useOutletContext<any>();
    const { chainConfig } = useConfig();
    const { guardiansInfo } = useGuardianStore();
    const { totalUsdValue, tokenBalance, tokenBalanceValid } = useBalanceStore();
    const [isLargerThan768] = useMediaQuery('min-width: 768px');
    const { historyList } = useHistoryStore();
    const valueLeft = totalUsdValue.split('.')[0];
    const valueRight = totalUsdValue.split('.')[1];

    const fontSize = getFontSize(valueLeft);

    const handleVerifyEmailClick = () => {
        if (isLargerThan768) {
            openModal('verifyEmail', { width: 640, height: 420 })
        } else {
            navigate('/verify-email')
        }
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
        >
            {(guardiansInfo && guardiansInfo.guardianHash && guardiansInfo.guardianHash === ZeroHash) && (
                <Box
                    paddingLeft={{
                        sm: '8px',
                        md: '0',
                    }}
                    paddingRight={{
                        sm: '8px',
                        md: '0',
                    }}
                    marginBottom="20px"
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        width={{
                            sm: '100%',
                            md: 'fit-content',
                        }}
                        minHeight={{
                            sm: '79px',
                            md: '48px',
                        }}
                        borderRadius="32px"
                        padding="12px 16px"
                        color="#0E1736"
                        justifyContent="space-between"
                        flexDirection={{
                            sm: 'row',
                            md: 'row-reverse',
                        }}
                        background={{
                            sm: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
                            md: 'white',
                        }}
                        onClick={handleVerifyEmailClick}
                        cursor="pointer"
                    >
                        <Box>
                            <Box
                                fontSize="32px"
                                lineHeight={"1"}
                                fontWeight="500"
                                display={{
                                    sm: 'flex',
                                    md: 'none'
                                }}
                            >
                                $10
                            </Box>
                            <Box
                                fontSize={{
                                    sm: '14px',
                                    md: '18px',
                                }}
                                lineHeight={{
                                    sm: '17px',
                                    md: '22.5px',
                                }}
                                fontWeight={{
                                    sm: '400',
                                    md: '500',
                                }}
                                opacity={{
                                    sm: '0.64',
                                    md: '1',
                                }}
                                color="#161F36"
                                display="flex"
                                alignItems="center"
                            >
                                Setup email recovery to get 10 USDC
                                <Box
                                    marginLeft="10px"
                                    display={{
                                        sm: 'none',
                                        md: 'flex',
                                    }}
                                >
                                    <ArrowRightIcon />
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Image
                                width={{
                                    sm: '40px',
                                    md: '32px'
                                }}
                                height={{
                                    sm: '40px',
                                    md: '32px'
                                }}
                                marginRight={{
                                    sm: '0px',
                                    md: '10px'
                                }}
                                src={USDCIcon}
                            />
                        </Box>
                    </Box>
                </Box>
            )}
            <Box
                display="flex"
                width="100%"
                flexDirection={{
                    sm: 'column',
                    md: 'row'
                }}
                height={{
                    sm: 'auto',
                    md: 'calc(100%)'
                }}
            >
                <Box
                    width={{
                        sm: '100%',
                        md: '56%'
                    }}
                >
                    <Box
                        width="100%"
                        padding={{
                            sm: '0 8px',
                            md: '32px',
                        }}
                        background={{
                            sm: 'transparent',
                            md: 'white'
                        }}
                        borderRadius={{
                            sm: '0',
                            md: '32px'
                        }}
                        marginBottom={{
                            sm: '0',
                            md: '20px'
                        }}
                    >
                        <Box display="flex" alignItems="center">
                            <Box fontSize="56px" lineHeight={"1"} fontWeight="500" marginRight="2px">
                                $
                            </Box>
                            <Box
                                fontSize={fontSize}
                                lineHeight={'1'}
                                fontWeight="500"
                                sx={{
                                    '@property --num': {
                                        syntax: `'<integer>'`,
                                        initialValue: '0',
                                        inherits: 'false',
                                    },
                                    '&': {
                                        transition: '--num 1s',
                                        counterReset: 'num var(--num)',
                                        '--num': valueLeft,
                                    },
                                    '&::after': {
                                        content: 'counter(num)',
                                    },
                                }}
                            />
                            {valueRight &&
                                BN(valueRight).isGreaterThan(0) &&
                                Number(valueRight.slice(0, 4).replace(/0+$/, '')) > 0 && (
                                    <Box
                                        fontSize={fontSize}
                                        lineHeight={'1'}
                                        fontWeight="500"
                                        color="#939393"
                                    >
                                        .
                                        <Box
                                            as="span"
                                        >
                                            {valueRight.slice(0, 4).replace(/0+$/, '')}
                                        </Box>
                                    </Box>
                                )}
                        </Box>
                    </Box>
                    <Box
                        width="100%"
                        background="white"
                        borderRadius="32px"
                        // boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
                        // border="1px solid #EAECF0"
                        position="relative"
                        zIndex="1"
                        paddingBottom={{
                            sm: '0',
                            md: '4px'
                        }}
                        display={{
                            sm: 'none',
                            md: 'flex'
                        }}
                        height="calc(100% - 140px)"
                        flexDirection="column"
                    >
                        <Box
                            fontSize="22px"
                            fontWeight="500"
                            color="#161F36"
                            padding="22px 32px"
                            display={{
                                sm: 'none',
                                md: 'flex'
                            }}
                            alignItems="center"
                            justifyContent="span-between"
                            width="100%"
                        >
                            <Box>
                                Activity
                            </Box>
                            <Box color="#676B75" cursor="pointer" fontWeight="500" fontSize="14px" marginLeft="auto" onClick={() => setActiveMenu('activities')}>
                                View more
                            </Box>
                        </Box>
                        <Box
                            width="100%"
                            // background="white"
                            overflow="auto"
                            paddingLeft="30px"
                            paddingRight="30px"
                            height="100%"
                        >
                            {historyList.length ? (
                                <Flex gap="16px" padding="0" flexDir="column" width="100%" paddingBottom="16px">
                                    {historyList.slice(0, 5).map((item, index) => (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            height={{
                                                sm: '52px',
                                                // md: '42px',
                                            }}
                                            key={index}
                                            width="100%"
                                        >
                                            <Image w="8" h="8" mr="10px" flex={"0 0 32px"} src={getIconMapping(item.functionName)} />
                                            <Box
                                                display="flex"
                                                alignItems="flex-start"
                                                width="calc(100% - 42px)"
                                                flexDirection={{
                                                    sm: 'column',
                                                    md: 'row',
                                                }}
                                                justifyContent={{
                                                    sm: 'center',
                                                    md: 'space-between',
                                                }}
                                            >
                                                <Box display="flex" alignItems="center">
                                                    <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36">
                                                        {getActivityName(item.functionName)}
                                                    </Box>
                                                    {(shouldShowAmount(item.functionName)) && (
                                                        <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36" marginLeft="4px">
                                                            <Box>
                                                                {item.tokenChanged}
                                                            </Box>
                                                            {item.toInfo && <Image ml="1" width="20px" height="20px" src={item.toInfo.logoURI} />}
                                                        </Box>
                                                    )}
                                                </Box>
                                                <Box fontSize="12px" fontWeight="400" lineHeight="15px" color="#95979C" marginTop="2px" display="flex" alignItems="center">
                                                    {getSubject(item.functionName)}{toShortAddress(item.interactAddress, 6)}
                                                    <Box
                                                        marginLeft="8px"
                                                        cursor="pointer"
                                                        display={{
                                                            sm: 'none',
                                                            md: 'block'
                                                        }}
                                                        onClick={() => window.open(`${chainConfig.scanUrl}/tx/${item.txHash}`, '_blank')}
                                                    >
                                                        <OpenIcon />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Flex>
                            ) : (
                                <Flex
                                    gap="16px"
                                    padding="0"
                                    width="100%"
                                    paddingBottom="16px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    height="100%"
                                >
                                    <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                                        <Image src={ActivityEmptyIcon} w={'216px'} h="108px" />
                                        <Box color="#676B75" marginTop="8px">
                                            You don’t have any activity yet
                                        </Box>
                                    </Box>
                                </Flex>
                            )}
                        </Box>
                    </Box>

                    <Box
                        width="100%"
                        paddingLeft="8px"
                        paddingRight="8px"
                        marginTop="14px"
                        marginBottom="40px"
                        display={{
                            sm: 'flex',
                            md: 'none'
                        }}
                    >
                        <Box width="calc((100% - 16px) / 3)" marginRight="8px">
                            <Box
                                background="#DCE4F2"
                                borderRadius="32px"
                                color="#161F36"
                                fontSize="18px"
                                fontWeight="400"
                                lineHeight="22.5px"
                                padding="12px 16px"
                                height="47px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                onClick={() => openFullScreenModal('send')}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    marginRight="4px"
                                >
                                    <SendIcon />
                                </Box>
                                <Box>Send</Box>
                            </Box>
                        </Box>
                        <Box width="calc((100% - 16px) / 3)" marginRight="8px">
                            <Box
                                background="#DCE4F2"
                                borderRadius="32px"
                                color="#161F36"
                                fontSize="18px"
                                fontWeight="400"
                                lineHeight="22.5px"
                                padding="12px 16px"
                                height="47px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                onClick={() => {
                                    openModal('receive', { width: 480, height: 600 })
                                }}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    marginRight="4px"
                                >
                                    <ReceiveIcon />
                                </Box>
                                <Box>Receive</Box>
                            </Box>
                        </Box>
                        <Box width="calc((100% - 16px) / 3)">
                            <Box
                                background="#DCE4F2"
                                borderRadius="32px"
                                color="#161F36"
                                fontSize="18px"
                                fontWeight="400"
                                lineHeight="22.5px"
                                padding="12px 16px"
                                height="47px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                onClick={() => openFullScreenModal('activity')}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    marginRight="4px"
                                >
                                    <ActivitiesIcon />
                                </Box>
                                <Box>Activity</Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box
                    width={{
                        sm: '100%',
                        md: '44%'
                    }}
                    paddingLeft={{
                        sm: '0',
                        md: '20px',
                    }}
                >
                    {tokenBalanceValid ? (
                        <Box
                            width="100%"
                            background="white"
                            borderRadius="32px"
                            // boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
                            // border="1px solid #EAECF0"
                            position="relative"
                            zIndex="1"
                            paddingBottom={{
                                sm: '0',
                                md: '4px'
                            }}
                            height="100%"
                        >
                            <Box
                                fontSize="22px"
                                fontWeight="500"
                                color="#161F36"
                                padding="22px 32px"
                                paddingBottom="0"
                                display={{
                                    sm: 'none',
                                    md: 'flex'
                                }}
                            >
                                Tokens
                            </Box>
                            <Box
                                padding={{
                                    sm: '12px 16px',
                                    md: '12px 32px'
                                }}
                                paddingBottom="0"
                                display="flex"
                                width="100%"
                                flexDirection="column"
                            >
                                {tokenBalance.map((item: any, index: number) => (
                                    <Box key={index} display="flex" alignItems="center" marginBottom="12px" width="100%">
                                        <Box marginRight="10px">
                                            <TokenIcon address={item.contractAddress} size={32} />
                                            {/* <Image src={item.logoURI} w="32px" h="32px" /> */}
                                        </Box>
                                        <Box fontWeight="500" fontSize="22px" lineHeight="24px" color="#161F36">
                                            {item.symbol}
                                        </Box>
                                        <Box marginLeft="auto" display="flex" flexDirection="column" alignItems="flex-end">
                                            <Box fontWeight="500" fontSize="22px" lineHeight="24px" color="#161F36">
                                                {item.tokenBalanceFormatted}
                                            </Box>
                                            <Box fontSize="12px" lineHeight="15px" color="#95979C">${item.usdValue || '0'}</Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ) : <Box
                        width="100%"
                        background="white"
                        borderRadius="32px"
                        height="377px"
                        boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
                        // border="1px solid #EAECF0"
                        position="relative"
                        zIndex="1"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginBottom="40px"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <Box marginBottom="20px">
                                <Image height="108px" w="216px" src={EmptyIcon} />
                            </Box>
                            <Box fontSize="18px" fontWeight="400" lineHeight="22.5px" color="#676B75">Deposit your first token to start</Box>
                            <Box marginTop="12px">
                                <Button size="lg" type="white" width="100px" fontSize="17px" onClick={() => openModal('receive', { width: 480, height: 600 })}>Deposit</Button>
                            </Box>
                        </Box>
                    </Box>}
                </Box>
            </Box>
        </Box>
    )
}