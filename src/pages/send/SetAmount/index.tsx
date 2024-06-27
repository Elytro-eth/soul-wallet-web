import { useEffect, useRef, useState, useCallback, Fragment } from 'react';
import {
  Box,
  Input,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import Header from '@/components/mobile/Header';
import QuestionIcon from '@/components/Icons/Question';
import SendingIcon from '@/components/Icons/mobile/Sending';
import SentIcon from '@/components/Icons/mobile/Sent';
import { useBalanceStore } from '@/store/balance';
import BN from 'bignumber.js';
import OpIcon from '@/assets/mobile/op.png';
import USDCIcon from '@/assets/mobile/usdc.png';
import { toFixed } from '@/lib/tools';
import { isAddress } from 'ethers';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver';
import SelectToken from '@/components/SelectToken';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import useScreenSize from '@/hooks/useScreenSize';

export default function SetAmount({
  isModal,
  onPrev,
  onNext,
  amount,
  setAmount,
  tokenAddress,
  setTokenAddress,
  selectedToken,
  setSelectedToken,
}: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { totalUsdValue } = useBalanceStore();
  const { innerHeight } = useScreenSize();

  const onAmountChange = (val: string) => {
    // validate decimals
    const regex = /^\d*(\.\d{0,6})?$/;

    while (val.length > 0 && !regex.test(val)) {
      // 逐步缩短字符串长度，直到找到一个合法的数值或字符串为空
      val = val.slice(0, -1);
    }

    setAmount(val);
  };

  const exceedBalance = amount && selectedToken && BN(amount).isGreaterThan(selectedToken.tokenBalanceFormatted);

  const disabled = !amount || amount <= 0 || exceedBalance || BN(amount).isNaN();

  console.log('amount', amount, typeof amount);

  return (
    <Box width="100%" height={innerHeight} overflowY="scroll">
      <Header title="" showBackButton={!isModal} onBack={onPrev} />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        <Box fontSize="28px" fontWeight="500">
          Amount
        </Box>
        <Box marginTop="24px">
          <Box fontSize="14px" fontWeight="400" color="#95979C" marginBottom="8px">
            Token
          </Box>
          <Box
            paddingTop="10px"
            display="flex"
            alignItems="center"
            position="relative"
            background="#F2F3F5"
            padding="16px"
            borderRadius="16px"
            height="56px"
          >
            <Box
              height="40px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              onClick={() => {
                isOpen ? onClose() : onOpen();
              }}
            >
              {!selectedToken && (
                <Box lineHeight="40px" fontSize="20px" fontWeight="400" color="#95979C">
                  Select a Token
                </Box>
              )}
              {!!selectedToken && (
                <Box display="flex" alignItems="center">
                  <Box marginRight="8px">
                    <Image width="36px" height="36px" src={selectedToken.logoURI} />
                  </Box>
                  <Box>
                    <Box fontSize="16px" fontWeight="500">
                      {selectedToken.name}
                    </Box>
                    <Box>{selectedToken.balance}</Box>
                  </Box>
                </Box>
              )}
              <Box>
                <ChevronDown />
              </Box>
            </Box>
            <Box position="absolute" top="60px" left="0" width="100%">
              <SelectToken
                isOpen={isOpen}
                select={(token: any) => {
                  setSelectedToken(token);
                  setTokenAddress(token.contractAddress);
                  onClose();
                }}
              />
            </Box>
          </Box>
          <Box fontSize="14px" fontWeight="400" color="#95979C" marginTop="24px">
            Amount
          </Box>
          <Box marginTop="8px">
            <Box display="flex" alignItems="center" height="56px" background="#F2F3F5" borderRadius="16px">
              <Input
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                height="56px"
                spellCheck={false}
                fontSize="20px"
                lineHeight="24px"
                fontWeight="400"
                placeholder="Enter an Amount"
                border="none"
                outline="none"
                background="#F2F3F5"
                padding="16px"
                borderRadius="16px"
                color="#161F36"
                _focusVisible={{ border: 'none', boxShadow: 'none' }}
              />
              <Box
                fontSize="18px"
                fontWeight="500"
                color={selectedToken ? '#3C3F45' : 'rgba(51, 34, 68, .3)'}
                onClick={() => {
                  selectedToken ? setAmount(parseFloat(selectedToken.tokenBalanceFormatted)) : null;
                }}
                paddingRight="16px"
              >
                MAX
              </Box>
            </Box>
          </Box>
          <Box pos="absolute">
            {exceedBalance && (
              <Box display="flex" alignItems="center" justifyContent="flex-start" marginTop="5px">
                <Box fontWeight="500" fontSize="14px" color="#E83D26">
                  Exceed the available balance
                </Box>
              </Box>
            )}
            {amount && BN(amount).isNaN() ? (
              <Box display="flex" alignItems="center" justifyContent="flex-start" marginTop="5px">
                <Box fontWeight="500" fontSize="14px" color="#E83D26">
                  Amount not valid
                </Box>
              </Box>
            ) : ''}
          </Box>
        </Box>
        <Box marginTop="40px" width="100%" display="flex">
          <Box width="50%" paddingRight="7px">
            <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">
              Back
            </Button>
          </Box>
          <Box width="50%" paddingLeft="7px">
            <Button width="calc(100% - 7px)" disabled={disabled} size="xl" type="gradientBlue" onClick={onNext}>
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
