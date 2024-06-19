import { Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'
import useScreenSize from '@/hooks/useScreenSize'

export default function SelectToken({
  onFinish,
}: any) {
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
          Select token and amount
        </Box>
        <Box
          fontSize="14px"
          fontWeight="500"
          marginTop="18px"
          textAlign="center"
          minHeight="80px"
        >
          Select tokens with balance and set up the amount you wish to transfer.
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
            padding="30px 10px"
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
              <Image width="72px" height="72px" src={USDCIcon} className="icon" />
            </Box>
            <Box
              fontWeight="700"
              fontSize="20px"
              marginTop="20px"
            >
              E.g. 100 USDC
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
