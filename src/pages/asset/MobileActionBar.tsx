import { Box } from "@chakra-ui/react"
import SendIcon from '@/components/Icons/mobile/Send2';
import ReceiveIcon from '@/components/Icons/mobile/Receive2';
import ActivitiesIcon from '@/components/Icons/mobile/Activities';
import useWalletContext from "@/context/hooks/useWalletContext";

export default function MobileActionBar() {
    const { openModal, openFullScreenModal } = useWalletContext();
    return <>
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
    </>
}