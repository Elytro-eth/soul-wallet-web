import { Box, Image, Text, useDisclosure } from "@chakra-ui/react";
import TrashIcon from '@/assets/trash.svg';
import ChromeIcon from '@/assets/devices/chrome.png'
import iCloudIcon from '@/assets/devices/iCloud.png'
import AndroidIcon from '@/assets/devices/Android.png'
import UnknownIcon from '@/assets/devices/Unknow.png'
import WindowsIcon from '@/assets/devices/Windows.png'
import { Address, encodeFunctionData, TransactionRequestBase } from "viem";
import { ABI_SoulWalletOwnerManager } from "@soulwallet/abi";
import { useAddressStore } from "@/store/address";
import ReviewModal from "@/components/ReviewModal";
import { useState } from "react";

export default function DeviceItem({
    deviceType = '',
    name = '',
    onchainPublicKey = '',
    reFetch = () => { }
}) {
    const { selectedAddress } = useAddressStore()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tx, setTx] = useState<TransactionRequestBase | null>(null);
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
        },
        'Windows Hello': {
            icon: WindowsIcon,
            deviceName: 'Windows'
        }
    }
    const icon = devices[deviceType] ? devices[deviceType].icon : UnknownIcon;
    const deviceName = devices[deviceType] ? devices[deviceType].deviceName : 'Unknown Device';
    const deleteDevice = () => {
        const deleteTx = {
            from: selectedAddress as Address,
            to: selectedAddress as Address,
            data: encodeFunctionData({
                abi: ABI_SoulWalletOwnerManager,
                functionName: 'removeOwner',
                args: [onchainPublicKey],
            })
        }
        setTx(() => {
            onOpen();
            return deleteTx;
        })
    }
    const afterClose = () => {
        onClose();
        reFetch();
    }
    return <>
        <Box
            p="20px"
            borderRadius='16px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            w='100%'
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
        <ReviewModal
            tx={tx}
            sendTo={selectedAddress as Address}
            isOpen={isOpen}
            actionName="Delete Passkey"
            onClose={afterClose}
        />
    </>
}