import { Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'
import CheckedIcon from '@/components/Icons/Success';

export default function ConfirmTransaction({
  onFinish,
}: any) {
  const innerHeight = window.innerHeight
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
          Confirm transaction
        </Box>
        <Box
          fontSize="14px"
          fontWeight="500"
          marginTop="18px"
          textAlign="center"
          minHeight="80px"
        >
          Review the info you provided, and confirm the transactions.
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
              width="129px"
              height="129px"
              borderRadius="12px"
              marginLeft="6px"
              marginRight="6px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {/* <Image width="72px" height="72px" src={USDCIcon} className="icon" /> */}
              <CheckedIcon size="129px" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
