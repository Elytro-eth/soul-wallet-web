import { Box, Image, useDisclosure } from '@chakra-ui/react';
import NextIcon from '@/components/Icons/mobile/Next'
import OpIcon from '@/assets/mobile/op.png'
import useScreenSize from '@/hooks/useScreenSize'

export default function SelectNetwork({ onNext }: any) {
  const { innerHeight } = useScreenSize()
  const contentHeight = innerHeight - 64 - 120

  return (
    <Box
      width="100%"
      height={contentHeight}
      position="relative"
      overflow="auto"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <Box padding="30px" paddingBottom="144px">
        <Box width="100%" fontSize="30px" fontWeight="700" textAlign="center" lineHeight="36px" marginTop="20px">
          Select OP Mainnet
        </Box>
        <Box fontSize="14px" fontWeight="500" marginTop="18px" textAlign="center" minHeight="80px">
          Please note that the network is OP Mainnet. Selecting other network means your assets will be lost.
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop="64px"
        >
          <Box
            background="#F1F1F1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            padding="30px"
            borderRadius="20px"
            width="180px"
            height="180px"
          >
            <Box
              width="72px"
              height="72px"
              borderRadius="12px"
              marginLeft="6px"
              marginRight="6px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image width="72px" height="72px" src={OpIcon} className="icon" />
            </Box>
            <Box
              fontWeight="700"
              fontSize="20px"
              marginTop="20px"
            >
              OP Mainnet
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
