import { useRef, useEffect } from 'react';
import {
    Box,
    Image,
    Menu,
    MenuList,
    useDisclosure
} from '@chakra-ui/react';
import DotsIcon from '@/components/Icons/mobile/Dots';
import { useOutletContext } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';
import ImgLogo from '@/assets/soul-logo.svg';
import OpIcon from '@/assets/mobile/op.png'
import { toShortAddress, getIconMapping } from '@/lib/tools';
import CopyIcon from '@/components/Icons/mobile/Copy';
import useTools from '@/hooks/useTools';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import LogoutIcon from '@/components/Icons/mobile/Logout'
import useWallet from '@/hooks/useWallet';

export function Header({ openMenu, username, ...props }: any) {
    const { walletName, selectedAddress } = useAddressStore();
    const { chainConfig } = useConfig();
    const { logoutWallet } = useWallet();
    const { openFullScreenModal, openModal } = useWalletContext();
    const { navigate } = useBrowser();

    const { doCopy } = useTools();
    const { isOpen: isTransferOpen, onOpen: onTransferOpen, onClose: onTransferClose } = useDisclosure();
    const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();

    const copyAddress = () => {
        doCopy(selectedAddress)
    }

    const transferMenuRef = useRef();
    const transferInputRef = useRef();

    const setTransferMenuRef = (value: any) => {
        transferMenuRef.current = value;
    };

    const setTransferInputRef = (value: any) => {
        transferInputRef.current = value;
    };

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (transferInputRef.current && !(transferInputRef.current as any).contains(event.target) && transferMenuRef.current && !(transferMenuRef.current as any).contains(event.target)) {
                onTransferClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const logoutMenuRef = useRef();
    const logoutInputRef = useRef();

    const setLogoutMenuRef = (value: any) => {
        logoutMenuRef.current = value;
    };

    const setLogoutInputRef = (value: any) => {
        logoutInputRef.current = value;
    };

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (logoutInputRef.current && !(logoutInputRef.current as any).contains(event.target) && logoutMenuRef.current && !(logoutMenuRef.current as any).contains(event.target)) {
                onLogoutClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Box
            height="56px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 24px"
            background="white"
            position="relative"
            {...props}
        >
            <Box
                display={{
                    sm: 'none',
                    md: 'flex',
                }}
                cursor="pointer"
                onClick={() => navigate('/landing')}
            >
                <Image src={ImgLogo} />
            </Box>
            <Box
                display={{
                    sm: 'flex',
                    md: 'none',
                }}
                gap="2"
                alignItems="center"
                justifyContent="center"
            >
                <Image src={chainConfig.icon} width="40px" height="40px" />
                <Box fontSize="20px" lineHeight="24px" fontWeight="400" color="#161F36">
                    {walletName}
                </Box>
            </Box>
            <Box
                fontSize="18px"
                fontWeight="500"
                color="black"
                lineHeight="24px"
                display="flex"
                alignItems="center"
            >
                <Box
                    height="42px"
                    borderRadius="22px"
                    padding="10px 12px"
                    paddingLeft="18px"
                    background="rgba(255, 255, 255, 1)"
                    display={{
                        sm: "none",
                        md: "flex"
                    }}
                    cursor="pointer"
                    marginRight="12px"
                    onClick={() => { isTransferOpen ? onTransferClose() : onTransferOpen() }}
                    position="relative"
                >
                    <Box display="flex" alignItems="center" justifyContent="center" ref={setTransferInputRef}>
                        <Box fontWeight="500" fontSize="14px" marginRight="4px" color="#161F36">Transfer</Box>
                        <Box><ChevronDown /></Box>
                    </Box>
                    <Box
                        position="absolute"
                        top="48px"
                        right="224px"
                        zIndex="2"
                    >
                        <Menu
                            isOpen={isTransferOpen}
                            isLazy
                        >
                            {() => (
                                <Box
                                    width="100%"
                                    overflow="auto"
                                    ref={setTransferMenuRef}
                                >
                                    <MenuList
                                        background="white"
                                        boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
                                        border="1px solid #F2F3F5"
                                        width="224px"
                                        borderRadius="24px"
                                        padding="8px"
                                    >
                                        <Box
                                            width="100%"
                                            position="relative"
                                            padding="0 8px"
                                            onClick={() => {
                                                onTransferClose()
                                                openFullScreenModal('send')
                                            }}
                                            display="flex"
                                            alignItems="center"
                                            height="48px"
                                            borderRadius="48px"
                                            transition="all 0.2s ease"
                                            _hover={{
                                                background: '#F2F3F5'
                                            }}
                                        >
                                            <Box>
                                                <Image w="8" h="8" mr="8px" flex="0 0 32px" src={getIconMapping('transfer eth')} />
                                            </Box>
                                            <Box fontSize="18px" fontWeight="500">Send</Box>
                                        </Box>
                                        <Box
                                            width="100%"
                                            position="relative"
                                            padding="0 8px"
                                            onClick={() => {
                                                onTransferClose()
                                                openModal('receive', { width: 480, height: 600 })
                                            }}
                                            display="flex"
                                            alignItems="center"
                                            height="48px"
                                            borderRadius="48px"
                                            transition="all 0.2s ease"
                                            _hover={{
                                                background: '#F2F3F5'
                                            }}
                                        >
                                            <Box>
                                                <Image w="8" h="8" mr="8px" flex="0 0 32px" src={getIconMapping('receive')} />
                                            </Box>
                                            <Box fontSize="18px" fontWeight="500">Receive</Box>
                                        </Box>
                                    </MenuList>
                                </Box>
                            )}
                        </Menu>
                    </Box>
                </Box>
                <Box
                    height="42px"
                    borderRadius="22px"
                    padding="10px 12px"
                    background="rgba(255, 255, 255, 0.5)"
                    display={{
                        sm: "none",
                        md: "flex"
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box marginRight="8px">
                            <Image width="20px" height="20px" src={OpIcon} />
                        </Box>
                        <Box fontWeight="500" fontSize="14px" marginRight="4px" color="#161F36">{walletName}</Box>
                        <Box fontWeight="400" fontSize="14px">({toShortAddress(selectedAddress)})</Box>
                        <Box marginLeft="4px" cursor="pointer" onClick={copyAddress}>
                            <CopyIcon color="#161F36" />
                        </Box>
                        <Box width="1px" height="20px" background="#BDC0C7" marginLeft="10px" marginRight="10px"></Box>
                        <Box
                            cursor="pointer"
                            onClick={() => { isLogoutOpen ? onLogoutClose() : onLogoutOpen() }}
                            ref={setLogoutInputRef}
                        >
                            <ChevronDown />
                        </Box>
                    </Box>
                    <Box
                        position="absolute"
                        top="60px"
                        right="240px"
                        zIndex="2"
                    >
                        <Menu
                            isOpen={isLogoutOpen}
                            isLazy
                        >
                            {() => (
                                <Box
                                    width="100%"
                                    overflow="auto"
                                    ref={setLogoutMenuRef}
                                >
                                    <MenuList
                                        background="white"
                                        boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
                                        border="1px solid #F2F3F5"
                                        width="224px"
                                        borderRadius="24px"
                                        padding="8px"
                                    >
                                        <Box
                                            width="100%"
                                            position="relative"
                                            padding="0 8px"
                                            onClick={() => {
                                                onLogoutClose();
                                                logoutWallet();
                                            }}
                                            display="flex"
                                            alignItems="center"
                                            height="48px"
                                            borderRadius="48px"
                                            transition="all 0.2s ease"
                                            cursor="pointer"
                                            _hover={{
                                                background: '#F2F3F5'
                                            }}
                                        >
                                            <Box marginRight="4px">
                                                <LogoutIcon />
                                            </Box>
                                            <Box fontSize="18px" fontWeight="500">Logout</Box>
                                        </Box>
                                    </MenuList>
                                </Box>
                            )}
                        </Menu>
                    </Box>
                </Box>

                <Box
                    height="36px"
                    width="36px"
                    borderRadius="36px"
                    alignItems="center"
                    justifyContent="center"
                    onClick={openMenu}
                    display={{
                        sm: "flex",
                        md: "none"
                    }}
                >
                    <Box
                        width="36px"
                        height="36px"
                        borderRadius="36px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <DotsIcon />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
