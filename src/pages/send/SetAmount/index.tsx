import { useEffect, useRef, useState, useCallback, Fragment } from 'react'
import { Box, Input, Image, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import QuestionIcon from '@/components/Icons/Question'
import SendingIcon from '@/components/Icons/mobile/Sending'
import SentIcon from '@/components/Icons/mobile/Sent'
import { useBalanceStore } from '@/store/balance';
import BN from 'bignumber.js'
import OpIcon from '@/assets/mobile/op.png'
import USDCIcon from '@/assets/mobile/usdc.png'
import { toFixed } from '@/lib/tools';
import { isAddress } from 'ethers';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver';

export default function SetAmount({ isModal, onPrev, onNext, withdrawAmount, setWithdrawAmount, sendTo, setSendTo }: any) {
  const { totalUsdValue, } = useBalanceStore();
  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 468

  const onAmountChange = (val: string) => {
    // validate decimals
    const regex = /^\d*(\.\d{0,6})?$/;

    while (val.length > 0 && !regex.test(val)) {
      // 逐步缩短字符串长度，直到找到一个合法的数值或字符串为空
      val = val.slice(0, -1);
    }

    setWithdrawAmount(val)
  }

  const disabled = (!withdrawAmount || withdrawAmount <= 0 || !sendTo || BN(withdrawAmount).isGreaterThan(totalUsdValue) || BN(withdrawAmount).isNaN())

  return (
    <Box width="100%" height={innerHeight} overflowY="scroll">
      <Header
        title=""
        showBackButton={!isModal}
        onBack={onPrev}
      />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        <Box fontSize="32px" fontWeight="700">
          Amount
        </Box>
        <Box marginTop="60px">
          <Box
            fontSize="14px"
            fontWeight="700"
            opacity="0.4"
          >
            Token
          </Box>
          <Box
            borderBottom="1px solid rgba(73, 126, 130, 0.2)"
            padding="10px 0"
            display="flex"
            alignItems="center"
            position="relative"
          >
            <Box height="40px" lineHeight="40px" fontSize="20px" fontWeight="600" color="rgba(0, 0, 0, 0.3)">Select a Token</Box>
          </Box>

          <Box
            fontSize="14px"
            fontWeight="700"
            opacity="0.4"
            marginTop="40px"
          >
            Amount
          </Box>
          <Box marginTop="8px">
            <Box
              borderBottom="1px solid rgba(73, 126, 130, 0.2)"
              padding="10px 0"
              display="flex"
              alignItems="center"
            >
              <Input
                value={withdrawAmount}
                onChange={e => onAmountChange(e.target.value)}
                fontSize="20px"
                lineHeight="100%"
                padding="0"
                fontWeight="700"
                placeholder="Enter an Amount"
                borderRadius="0"
                border="none"
                outline="none"
                _focusVisible={{ border: 'none', boxShadow: 'none' }}
              />
              <Box
                fontSize="14px"
                fontWeight="700"
                color="rgba(0, 0, 0, 0.2)"
              >
                MAX
              </Box>
            </Box>
          </Box>
          {/* <Box pos="absolute">
              {BN(withdrawAmount).isGreaterThan(totalUsdValue) &&  <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              marginTop="5px"
              >
              <Box
              fontWeight="700"
              fontSize="14px"
              color="#E83D26"
              >
              Exceed the available balance
              </Box>
              </Box>}
              {withdrawAmount && BN(withdrawAmount).isNaN() &&  <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              marginTop="5px"
              >
              <Box
              fontWeight="700"
              fontSize="14px"
              color="#E83D26"
              >
              Not a valid number
              </Box>
              </Box>}
              <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              marginTop="5px"
              >
              <Box
              fontWeight="600"
              fontSize="14px"
              >
              Available: {toFixed(totalUsdValue, 3)} USDC
              </Box>
              <Box
              background="rgba(225, 220, 252, 0.80)"
              color="#6A52EF"
              spellCheck={false}
              fontSize="14px"
              borderRadius="48px"
              padding="2px 12px"
              fontWeight="700"
              marginLeft="10px"
              onClick={()=> setWithdrawAmount(Number(totalUsdValue))}
              >
              MAX
              </Box>
              </Box>
              </Box> */}
        </Box>
        <Box
          marginTop="40px"
          width="100%"
          display="flex"
        >
          <Box width="50%" paddingRight="7px">
            <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">Back</Button>
          </Box>
          <Box width="50%" paddingLeft="7px">
            <Button width="calc(100% - 7px)" disabled={false} size="xl" type="blue" onClick={onNext}>Continue</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
