import { Box, Image, useDisclosure } from '@chakra-ui/react';
import NextIcon from '@/components/Icons/mobile/Next'
import OpIcon from '@/assets/mobile/op.png'
import useScreenSize from '@/hooks/useScreenSize'
import Button from '@/components/mobile/Button'

export default function SelectNetwork({ onNext }: any) {
  const { innerHeight } = useScreenSize()
  const contentHeight = innerHeight - 82

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
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        padding="0 32px"
        height="360px"
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <Box>
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
            <Image width="96px" height="96px" src={OpIcon} className="icon" />
          </Box>
        </Box>
        <Box width="100%" fontSize="28px" fontWeight="500" lineHeight="36px" marginTop="20px" textAlign="center">
          Select Optimism network
        </Box>
        <Box fontSize="14px" fontWeight="400" marginTop="18px" textAlign="center" color="#676B75">
          Please note that the network is Optimism. Selecting other network means your assets will be lost.
        </Box>
        <Box marginTop="auto">
          <Button size="xl" type="gradientBlue" width="100%" onClick={onNext}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
