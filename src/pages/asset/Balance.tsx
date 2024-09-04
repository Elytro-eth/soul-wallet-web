import { useBalanceStore } from "@/store/balance";
import { Box } from "@chakra-ui/react";
import BN from 'bignumber.js';

export default function Balance() {
    const { totalUsdValue } = useBalanceStore();
    const valueLeft = totalUsdValue.split('.')[0];
    const valueRight = totalUsdValue.split('.')[1];
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
    const fontSize = getFontSize(valueLeft);
    return <Box display="flex" alignItems="center">
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
}