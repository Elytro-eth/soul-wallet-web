import { Box, Image, Text } from "@chakra-ui/react";
import TrashIcon from '@/assets/trash.svg';
import ChromeIcon from '@/assets/devices/chrome.png'
import IphoneIcon from '@/assets/devices/iphone.svg'
import AndroidIcon from '@/assets/devices/android.svg'

export default function DeviceItem({
    isCurrent = true,
    deviceType = '',
    name = '',
}) {
    const currentStyle = isCurrent ? {
        bg: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)'
    } : {
        border: '1px',
        borderColor: '#EAEAEA'
    };
    const devices: {
        [key: string]: {
            icon: string,
            deviceName: string
        }
    } = {
        iphone: {
            icon: IphoneIcon,
            deviceName: 'iPhone'
        },
        chrome: {
            icon: ChromeIcon,
            deviceName: 'Chrome'
        },
        android: {
            icon: AndroidIcon,
            deviceName: 'Android'
        }
    }
    const icon = devices[deviceType] ? devices[deviceType].icon : IphoneIcon;
    const deviceName = devices[deviceType] ? devices[deviceType].deviceName : 'Unknown Device';
    return <Box
        p="20px"
        borderRadius='16px'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        w={{
            base: '100%',
        }}
        {...currentStyle}
    >
        <Box
            display='flex'
            alignItems='center'
        >
            <Box
                borderRadius='50%'
                w='48px'
                h='48px'
                bg={isCurrent ? "white" : "#F5F5F5"}
                display='flex'
                alignItems='center'
                justifyContent='center'
            >
                <Image w='24px' h='24px' src={icon} />
            </Box>
            <Box marginLeft='10px'>
                <Text fontSize='18px'>{deviceName}</Text>
                <Text fontSize='12px' color='#676B75'>{name}</Text>
            </Box>
        </Box>
        {
            !isCurrent && <Box>
                <Image src={TrashIcon} />
            </Box>
        }
    </Box>
}