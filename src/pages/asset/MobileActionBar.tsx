import { Box } from "@chakra-ui/react"
import SendIcon from '@/components/Icons/mobile/Send2';
import ReceiveIcon from '@/components/Icons/mobile/Receive2';
import ActivitiesIcon from '@/components/Icons/mobile/Activities';
import useWalletContext from "@/context/hooks/useWalletContext";

export default function MobileActionBar() {
    const { openFullScreenModal } = useWalletContext();
    return <>
        <Box display='flex' justifyContent="space-around" width="100%">
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
                flex={1}
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
            <Box
                flex={1}
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
                marginX='6px'
                onClick={() => {
                    openFullScreenModal('receive')
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
            <Box
                flex={1}
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
    </>
}