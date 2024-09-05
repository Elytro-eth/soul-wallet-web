import useWalletContext from "@/context/hooks/useWalletContext";
import useBrowser from "@/hooks/useBrowser";
import { useGuardianStore } from "@/store/guardian";
import { Box, useMediaQuery, Image } from "@chakra-ui/react";
import { ZeroHash } from 'ethers';
import ArrowRightIcon from '@/components/Icons/desktop/ArrowRight';
import USDCIcon from '@/assets/mobile/usdc.png'
import useIsMobile from "@/hooks/useIsMobile";


export default function GuardianGuide() {
    const { guardiansInfo } = useGuardianStore();
    const isMobile = useIsMobile()
    const { openFullScreenModal, openModal } = useWalletContext()
    const handleVerifyEmailClick = () => {
        if (isMobile) {
            openFullScreenModal('verifyEmail')
        } else {
            openModal('verifyEmail')
        }
    }
    if (!(guardiansInfo && guardiansInfo.guardianHash && guardiansInfo.guardianHash === ZeroHash)) return null;
    return <Box
        paddingLeft={{
            base: '8px',
            lg: '0',
        }}
        paddingRight={{
            base: '8px',
            lg: '0',
        }}
        marginBottom="20px"
    >
        <Box
            display="flex"
            alignItems="center"
            width='100%'
            minHeight={{
                base: '79px',
                lg: '48px',
            }}
            borderRadius="32px"
            padding="12px 16px"
            color="#0E1736"
            justifyContent={{
                base: "space-between",
                lg: "start"
            }}
            flexDirection={{
                base: 'row',
                lg: 'row-reverse',
            }}
            background={{
                base: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
                lg: 'white',
            }}
            onClick={handleVerifyEmailClick}
            cursor="pointer"
        >
            <Box>
                <Box
                    fontSize="32px"
                    lineHeight={"1"}
                    fontWeight="500"
                    display={{
                        base: 'flex',
                        lg: 'none'
                    }}
                >
                    $10
                </Box>
                <Box
                    fontSize={{
                        base: '14px',
                        lg: '18px',
                    }}
                    lineHeight={{
                        base: '17px',
                        lg: '22.5px',
                    }}
                    fontWeight={{
                        base: '400',
                        lg: '500',
                    }}
                    opacity={{
                        base: '0.64',
                        lg: '1',
                    }}
                    color="#161F36"
                    display="flex"
                    alignItems="center"
                >
                    Setup email recovery to get 10 USDC
                    <Box
                        marginLeft="10px"
                        display={{
                            base: 'none',
                            lg: 'flex',
                        }}
                    >
                        <ArrowRightIcon />
                    </Box>
                </Box>
            </Box>
            <Box>
                <Image
                    width={{
                        base: '40px',
                        lg: '32px'
                    }}
                    height={{
                        base: '40px',
                        lg: '32px'
                    }}
                    marginRight={{
                        base: '0px',
                        lg: '10px'
                    }}
                    src={USDCIcon}
                />
            </Box>
        </Box>
    </Box>
}