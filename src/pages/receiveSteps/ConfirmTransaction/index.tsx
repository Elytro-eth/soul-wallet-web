import { Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'
import CheckedIcon from '@/components/Icons/Success';
import useScreenSize from '@/hooks/useScreenSize'
import Button from '@/components/mobile/Button'
import CompleteIcon from '@/assets/mobile/complete.svg'

export default function ConfirmTransaction({
  onFinish,
}: any) {
  const { innerHeight } = useScreenSize()
  const contentHeight = innerHeight - 82

  return (
    <Box
      width="100%"
      height={{ base: contentHeight, lg: '440px' }}
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
            width="135px"
            height="96px"
            borderRadius="12px"
            marginLeft="6px"
            marginRight="6px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin="0 auto"
          >
            <Image width="96px" height="96px" src={CompleteIcon} className="icon" />
          </Box>
        </Box>
        <Box width="100%" fontSize="28px" fontWeight="500" lineHeight="36px" marginTop="20px" textAlign="center">
          Confirm transaction
        </Box>
        <Box fontSize="14px" fontWeight="400" marginTop="18px" textAlign="center" color="#676B75">
          Review the info you provided, and confirm the transactions.
        </Box>
        <Box marginTop="auto">
          <Button size="xl" type="gradientBlue" width="100%" onClick={onFinish}>Done</Button>
        </Box>
      </Box>
    </Box>
  );
}
