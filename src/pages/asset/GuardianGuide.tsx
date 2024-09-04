import useWalletContext from "@/context/hooks/useWalletContext";
import useBrowser from "@/hooks/useBrowser";
import { useGuardianStore } from "@/store/guardian";
import { Box, useMediaQuery, Image } from "@chakra-ui/react";
import { ZeroHash } from 'ethers';
import ArrowRightIcon from '@/components/Icons/desktop/ArrowRight';
import USDCIcon from '@/assets/mobile/usdc.png'


export default function GuardianGuide() {
    const { guardiansInfo } = useGuardianStore();
    const [isLargerThan768] = useMediaQuery('min-width: 768px');
    const { navigate } = useBrowser();
    const { openModal } = useWalletContext()
    const handleVerifyEmailClick = () => {
        if (isLargerThan768) {
            openModal('verifyEmail', { width: 640, height: 420 })
        } else {
            navigate('/verify-email')
        }
    }
    if (!(guardiansInfo && guardiansInfo.guardianHash && guardiansInfo.guardianHash === ZeroHash)) return null;
    return <Box
        paddingLeft={{
            sm: '8px',
            md: '0',
        }}
        paddingRight={{
            sm: '8px',
            md: '0',
        }}
        marginBottom="20px"
    >
        <Box
            display="flex"
            alignItems="center"
            width='100%'
            minHeight={{
                sm: '79px',
                md: '48px',
            }}
            borderRadius="32px"
            padding="12px 16px"
            color="#0E1736"
            justifyContent={{
                sm: "space-between",
                md: "start"
            }}
            flexDirection={{
                sm: 'row',
                md: 'row-reverse',
            }}
            background={{
                sm: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
                md: 'white',
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
                        sm: 'flex',
                        md: 'none'
                    }}
                >
                    $10
                </Box>
                <Box
                    fontSize={{
                        sm: '14px',
                        md: '18px',
                    }}
                    lineHeight={{
                        sm: '17px',
                        md: '22.5px',
                    }}
                    fontWeight={{
                        sm: '400',
                        md: '500',
                    }}
                    opacity={{
                        sm: '0.64',
                        md: '1',
                    }}
                    color="#161F36"
                    display="flex"
                    alignItems="center"
                >
                    Setup email recovery to get 10 USDC
                    <Box
                        marginLeft="10px"
                        display={{
                            sm: 'none',
                            md: 'flex',
                        }}
                    >
                        <ArrowRightIcon />
                    </Box>
                </Box>
            </Box>
            <Box>
                <Image
                    width={{
                        sm: '40px',
                        md: '32px'
                    }}
                    height={{
                        sm: '40px',
                        md: '32px'
                    }}
                    marginRight={{
                        sm: '0px',
                        md: '10px'
                    }}
                    src={USDCIcon}
                />
            </Box>
        </Box>
    </Box>
}