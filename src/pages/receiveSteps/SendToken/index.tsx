import { Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'
import useScreenSize from '@/hooks/useScreenSize'
import Button from '@/components/mobile/Button'

export default function SelectToken({
  onFinish,
  onNext,
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
      <Box padding="30px">
        <Box paddingTop="10px">
          <Box
            width="96px"
            height="96px"
            borderRadius="12px"
            marginLeft="6px"
            marginRight="6px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin="0 auto"
          >
            <Image width="96px" height="96px" src={USDCIcon} className="icon" />
          </Box>
        </Box>
        <Box width="100%" fontSize="28px" fontWeight="500" lineHeight="36px" marginTop="20px" textAlign="center">
          Select token and amount
        </Box>
        <Box fontSize="14px" fontWeight="400" marginTop="18px" textAlign="center" color="#676B75">
          Select tokens with balance and set up the amount you wish to transfer.
        </Box>
        <Box marginTop="40px">
          <Button size="xl" type="gradientBlue" width="100%" onClick={onNext}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
