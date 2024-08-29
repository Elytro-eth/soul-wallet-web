import { Box, Image } from "@chakra-ui/react";
import IconLoading from '@/assets/mobile/loading.gif';

export default function PageLoading() {
    return <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minH={'300px'}
    >
        <Image src={IconLoading} height='56px' />
    </Box>
}