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
  const menuRef = useRef();
  const inputRef = useRef();

  const setMenuRef = (value: any) => {
    menuRef.current = value;
  };

  const setInputRef = (value: any) => {
    inputRef.current = value;
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (inputRef.current && !(inputRef.current as any).contains(event.target) && menuRef.current && !(menuRef.current as any).contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onAmountChange = (val: string) => {
    // validate decimals
    const regex = /^\d*(\.\d{0,6})?$/;

    while (val.length > 0 && !regex.test(val)) {
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
      <Box
        padding="30px"
        minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}
        paddingTop={{
          base: '30px',
          lg: '0',
        }}
      >
        <Box fontSize="28px" fontWeight="500" color="#161F36">
          Amount
        </Box>
        <Box marginTop="24px">
          <Box
            fontSize="14px"
            lineHeight="17.5px"
            fontWeight="400"
            color="#95979C"
            marginBottom="8px"
          >
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
              ref={setInputRef}
              onClick={() => {
                isOpen ? onClose() : onOpen();
              }}
              cursor="pointer"
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
                    <Box fontSize="18px" color="#161F36" fontWeight="500">
                      {selectedToken.symbol}
                    </Box>
                    <Box color="#95979C" fontSize="14px" fontWeight="400">Balance: {toFixed(selectedToken.tokenBalanceFormatted, 3)}</Box>
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
                onClose={onClose}
                setMenuRef={setMenuRef}
                select={(token: any) => {
                  setSelectedToken(token);
                  setTokenAddress(token.contractAddress);
                  onClose();
                }}
              />
            </Box>
          </Box>
          <Box
            fontSize="14px"
            fontWeight="400"
            color="#95979C"
            marginTop="24px"
            lineHeight="17.5px"
          >
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
                  selectedToken ? setAmount(selectedToken.tokenBalanceFormatted) : null;
                }}
                paddingRight="16px"
              >
                MAX
              </Box>
            </Box>
          </Box>
          <Box pos="absolute">
            {!!exceedBalance && (
              <Box display="flex" alignItems="center" justifyContent="flex-start" marginTop="5px">
                <Box fontWeight="500" fontSize="14px" color="#E83D26">
                  Exceed the available balance
                </Box>
              </Box>
            )}
            {!!amount && BN(amount).isNaN() ? (
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
