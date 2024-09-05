import { useBalanceStore } from "@/store/balance";
import { Box, Image } from "@chakra-ui/react";
import EmptyIcon from '@/assets/mobile/activity-empty.png'
import TokenIcon from '@/components/TokenIcon';
import Button from '@/components/mobile/Button';
import useWalletContext from "@/context/hooks/useWalletContext";

export default function Tokens() {
    const { tokenBalance, tokenBalanceValid } = useBalanceStore();
    const { openModal } = useWalletContext();
    if (!tokenBalanceValid) return <Box
        width="100%"
        background="white"
        borderRadius="32px"
        height="377px"
        boxShadow="0px 4px 30px 0px rgba(44, 53, 131, 0.08)"
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
    </Box>
    return <Box
        width="100%"
        background="white"
        borderRadius="32px"
        position="relative"
        zIndex="1"
        paddingBottom={{
            base: '0',
            lg: '4px'
        }}
        height="100%"
        overflow='auto'
    >
        <Box
            fontSize="22px"
            fontWeight="500"
            color="#161F36"
            padding="22px 32px"
            paddingBottom="0"
            display={{
                base: 'none',
                lg: 'flex'
            }}
        >
            Tokens
        </Box>
        <Box
            padding={{
                base: '12px 16px',
                lg: '12px 32px'
            }}
            paddingBottom="0"
            display="flex"
            width="100%"
            flexDirection="column"
        >
            {tokenBalance.map((item, index: number) => (
                <Box key={index} display="flex" alignItems="center" marginBottom="12px" width="100%">
                    <Box marginRight="10px">
                        <TokenIcon address={item.contractAddress} size={32} />
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
}