import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Image, useDisclosure } from '@chakra-ui/react';
import NextIcon from '@/components/Icons/mobile/Next'
import MetamaskIcon from '@/assets/mobile/metamask.png'
import OKEXIcon from '@/assets/mobile/okex.png'
import CoinbaseIcon from '@/assets/mobile/coinbase.png'
import BinanceIcon from '@/assets/mobile/binance.png'
import useScreenSize from '@/hooks/useScreenSize'
import Button from '@/components/mobile/Button'

export default function MakeTransfer({ onNext, registerScrollable }: any) {
  const scrollableRef = useRef<any>()
  const { innerHeight } = useScreenSize()
  const contentHeight = innerHeight - 64 - 120

  useEffect(() => {
    if (registerScrollable) registerScrollable(scrollableRef.current)
  }, [])

  return (
    <Box
      width="100%"
      height={contentHeight}
      position="relative"
      ref={scrollableRef}
    >
      <Box padding="30px">
        <Box width="100%" fontSize="28px" fontWeight="500" lineHeight="36px" marginTop="20px" color="#161F36">
          Initiate a transfer
        </Box>
        <Box
          fontSize="14px"
          fontWeight="400"
          marginTop="18px"
          color="#676B75"
        >
          {`Find the “Send” or “Transfer button” in your wallet or exchange account. And paste the address you copied from last step.`}
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop="40px"
          gap="6"
          transition="0.6s all ease"
        >
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={MetamaskIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={OKEXIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={CoinbaseIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={BinanceIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {`...`}
          </Box>
        </Box>
        <Box marginTop="40px">
          <Button size="xl" type="gradientBlue" width="100%" onClick={onNext}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
