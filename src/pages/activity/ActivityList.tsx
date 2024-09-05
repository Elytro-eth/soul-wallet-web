
import { Box, Flex, Image } from '@chakra-ui/react';
import { getIconMapping, toShortAddress } from '@/lib/tools';
import { useHistoryStore } from '@/store/history';
import OpenIcon from '@/components/Icons/desktop/Open';
import ActivityEmptyIcon from '@/assets/mobile/activity-empty.png';
import useConfig from '@/hooks/useConfig';

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

const shouldShowAmount = (functionName: any) => {
    return functionName === 'Send' || functionName === 'Receive' || functionName.indexOf('Transfer') !== -1
}

export default function ActivityList() {
    const { historyList } = useHistoryStore();
    const { chainConfig } = useConfig();
    if (!historyList.length) return <Flex
        gap="16px"
        padding="0"
        width="100%"
        paddingBottom="16px"
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Image src={ActivityEmptyIcon} w={'216px'} h="108px" />
            <Box color="#676B75" marginTop="8px">
                You don’t have any activity yet
            </Box>
        </Box>
    </Flex>;
    return <Flex gap="16px" padding="0" flexDir="column" width="100%" paddingBottom="16px">
        {historyList.map((item, index) => (
            <Box
                display="flex"
                alignItems="center"
                height={{
                    base: '52px',
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
                        base: 'column',
                        lg: 'row',
                    }}
                    justifyContent={{
                        base: 'center',
                        lg: 'space-between',
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
                                base: 'none',
                                lg: 'block'
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
}