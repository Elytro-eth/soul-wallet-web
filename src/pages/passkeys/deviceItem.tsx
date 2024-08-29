import { Box, Image, Text } from "@chakra-ui/react";
import TrashIcon from '@/assets/trash.svg';
import ChromeIcon from '@/assets/devices/chrome.png'
import iCloudIcon from '@/assets/devices/iCloud.png'
import AndroidIcon from '@/assets/devices/Android.png'
import UnknownIcon from '@/assets/devices/Unknow.png'
import { encodeFunctionData } from "viem";
import { ABI_SoulWalletOwnerManager } from "@soulwallet/abi";
import { useAddressStore } from "@/store/address";
import useWallet from "@/hooks/useWallet";

export default function DeviceItem({
    deviceType = '',
    name = '',
    onchainPublicKey = ''
}) {
    const { selectedAddress } = useAddressStore()
    const { sendTxs } = useWallet()
    const isCurrent = !Boolean(onchainPublicKey)
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
        'iCloud Keychain': {
            icon: iCloudIcon,
            deviceName: 'iCloud Keychain'
        },
        'Chrome on Mac': {
            icon: ChromeIcon,
            deviceName: 'Chrome'
        },
        'Google Password Manager': {
            icon: AndroidIcon,
            deviceName: 'Android'
        }
    }
    const icon = devices[deviceType] ? devices[deviceType].icon : UnknownIcon;
    const deviceName = devices[deviceType] ? devices[deviceType].deviceName : 'Unknown Device';
    const deleteDevice = async () => {
        const deleteTx = {
            from: selectedAddress,
            to: selectedAddress,
            data: encodeFunctionData({
                abi: ABI_SoulWalletOwnerManager,
                functionName: 'removeOwner',
                args: [onchainPublicKey],
            })
        }
        try {
            // await sendTxs([deleteTx])
        } catch (err) {
            throw err;
        }
    }
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
                flexShrink={0}
            >
                <Image src={icon} />
            </Box>
            <Box marginLeft='10px'>
                <Text fontSize='18px'>{deviceName}</Text>
                <Text fontSize='12px' color='#676B75'>{name}</Text>
            </Box>
        </Box>
        {
            !isCurrent && <Box
                w='48px'
                h='48px'
                borderRadius='50%'
                display='flex'
                alignItems='center'
                justifyContent='center'
                _hover={{
                    bg: '#F5F5F5',
                    cursor: 'pointer'
                }}
                onClick={deleteDevice}
            >
                <Image src={TrashIcon} />
            </Box>
        }
    </Box>
}