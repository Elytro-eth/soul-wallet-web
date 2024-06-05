import { useEffect, useRef, useState, useCallback, Fragment } from 'react'
import { Box, Input, Image } from '@chakra-ui/react';
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

export default function InputAmount({
  withdrawAmount,
  onWithdrawAmountChange,
  sendTo,
  onSendToChange,
  isModal
}: any) {
  const { totalUsdValue, } = useBalanceStore();
  const [isENSOpen, setIsENSOpen] = useState(false);
  const [isENSLoading, setIsENSLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [step, setStep] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const onAmountChange = (val: string) => {
    // validate decimals
    const regex = /^\d*(\.\d{0,6})?$/;

    while (val.length > 0 && !regex.test(val)) {
      // 逐步缩短字符串长度，直到找到一个合法的数值或字符串为空
      val = val.slice(0, -1);
    }

    onWithdrawAmountChange(val)
  }

  const onAddressChange = (val: string) => {
    onSendToChange(val);
    setSearchText(val);

    if (extractENSAddress(val)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  }


  const activeENSNameRef = useRef();
  const menuRef = useRef();
  const inputRef = useRef();

  const inputOnFocus = (value: any) => {
    setSearchText(value);

    if (extractENSAddress(value)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  };

  const setMenuRef = (value: any) => {
    menuRef.current = value;
  };

  const setInputRef = (value: any) => {
    inputRef.current = value;
  };

  const setActiveENSNameRef = (value: any) => {
    activeENSNameRef.current = value;
  };

  const getActiveENSNameRef = (value: any) => {
    return activeENSNameRef.current;
  };

  const onPrev = useCallback(() => {
    console.log('prev', step);
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  }, [step]);

  const onNext = useCallback(() => {
    console.log('next');
    setStep(step + 1);
  }, [step]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        inputRef.current &&
        !(inputRef.current as any).contains(event.target) &&
        menuRef.current &&
        !(menuRef.current as any).contains(event.target)
      ) {
        setIsENSOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress);
    onSendToChange(resolvedAddress)
    // setErrors(({ receiverAddress, ...rest }: any) => rest);
    setIsENSOpen(false);
  };

  const disabled = (step === 0) ? (!isAddress(sendTo)) : (!withdrawAmount || withdrawAmount <= 0 || !sendTo || BN(withdrawAmount).isGreaterThan(totalUsdValue) || BN(withdrawAmount).isNaN())

  return (
    <Box width="100%" height="100%">
      <Header
        title=""
        showBackButton={!isModal}
        onBack={onPrev}
      />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        {(step === 0) && (
          <Fragment>
            <Box fontSize="32px" fontWeight="700">
              Recipient
            </Box>
            <Box marginTop="60px">
              <Box
                fontSize="14px"
                fontWeight="700"
                opacity="0.4"
              >
                To
              </Box>
              <Box
                borderBottom="1px solid rgba(73, 126, 130, 0.2)"
                padding="10px 0"
                display="flex"
                alignItems="center"
                position="relative"
              >
                <Input
                  value={sendTo}
                  spellCheck={false}
                  onChange={e => onAddressChange(e.target.value)}
                  onFocus={(e: any) => inputOnFocus(e.target.value)}
                  ref={setInputRef}
                  fontSize="18px"
                  lineHeight="100%"
                  padding="0"
                  fontWeight="700"
                  placeholder="Enter wallet address or ENS"
                  borderRadius="0"
                  border="none"
                  outline="none"
                  _focusVisible={{ border: 'none', boxShadow: 'none' }}
                />
                <ENSResolver
                  _styles={{
                    width: '100%',
                    top: '65px',
                    left: '0',
                    right: '0',
                    borderRadius: '12px'
                  }}
                  isENSOpen={isENSOpen}
                  setIsENSOpen={setIsENSOpen}
                  isENSLoading={isENSLoading}
                  setIsENSLoading={setIsENSLoading}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  searchAddress={searchAddress}
                  setSearchAddress={setSearchAddress}
                  resolvedAddress={resolvedAddress}
                  setResolvedAddress={setResolvedAddress}
                  setMenuRef={setMenuRef}
                  submitENSName={submitENSName}
                  setActiveENSNameRef={setActiveENSNameRef}
                  getActiveENSNameRef={getActiveENSNameRef}
                />
              </Box>
            </Box>
            <Box
              fontSize="14px"
              fontWeight="700"
              opacity="0.4"
              marginTop="40px"
            >
              Network
            </Box>
            <Box marginTop="8px" display="flex" alignItems="center">
              <Box marginRight="8px"><Image w="32px" h="32px" src={OpIcon} /></Box>
              <Box fontSize="20px" fontWeight="600">Optimism</Box>
              <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center"><QuestionIcon /></Box>
            </Box>
            <Box
              marginTop="40px"
              width="100%"
            >
              <Button disabled={false} size="xl" type="blue" width="100%" onClick={() => setStep(1)}>Continue</Button>
            </Box>
          </Fragment>
        )}
        {(step === 1) && (
          <Fragment>
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
                  onClick={()=> onWithdrawAmountChange(Number(totalUsdValue))}
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
          </Fragment>
        )}
        {(step === 2) && (
          <Fragment>
            {(isSent) && (
              <Box fontSize="32px" fontWeight="700" display="flex" alignItems="center">
                <Box marginRight="12px"><SentIcon /></Box>
                Completed
              </Box>
            )}
            {(isSending && !isSent) && (
              <Box fontSize="32px" fontWeight="700" display="flex" alignItems="center">
                <Box marginRight="12px"><SendingIcon /></Box>
                Sending
              </Box>
            )}
            {(!isSending && !isSent) && (
              <Box fontSize="32px" fontWeight="700">
                Review
              </Box>
            )}
            <Box marginTop="60px">
              <Box
                fontSize="14px"
                fontWeight="700"
                opacity="0.4"
              >
                Send
              </Box>
              <Box marginTop="8px" display="flex" alignItems="center">
                <Box marginRight="8px"><Image w="32px" h="32px" src={USDCIcon} /></Box>
                <Box fontSize="24px" fontWeight="600">10.1111 ETH</Box>
              </Box>

              <Box
                padding="10px 0"
                display="flex"
                alignItems="center"
                position="relative"
              >
              </Box>
            </Box>
            <Box marginTop="60px">
              <Box
                fontSize="14px"
                fontWeight="700"
                opacity="0.4"
              >
                To
              </Box>
              <Box
                marginTop="8px"
                alignItems="center"
                width="100%"
                display="inline-block"
              >
                <Box as="span" fontSize="24px" fontWeight="600">0x8d34</Box>
                <Box as="span" fontSize="24px" fontWeight="600" color="rgba(0, 0, 0, 0.4)">947d8cba2abd7e8d5b788c8a3674325c93d1</Box>
                <Box as="span" fontSize="24px" fontWeight="600">5c93d1</Box>
              </Box>

              <Box
                padding="10px 0"
                display="flex"
                alignItems="center"
                position="relative"
              >
              </Box>
            </Box>
            <Box
              fontSize="14px"
              fontWeight="700"
              opacity="0.4"
              marginTop="40px"
            >
              Network
            </Box>
            <Box marginTop="8px" display="flex" alignItems="center">
              <Box marginRight="8px"><Image w="32px" h="32px" src={OpIcon} /></Box>
              <Box fontSize="20px" fontWeight="600">Optimism</Box>
              <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center"><QuestionIcon /></Box>
            </Box>
            <Box
              fontSize="14px"
              fontWeight="700"
              opacity="0.4"
              marginTop="40px"
            >
              Fee
            </Box>
            <Box marginTop="8px" display="flex" alignItems="center">
              <Box fontSize="20px" fontWeight="600">$0</Box>
            </Box>
            {isSent && (
              <Box
                marginTop="40px"
                width="100%"
              >
                <Box width="100%" marginBottom="20px">
                  <Button width="calc(100%)" disabled={false} size="xl" type="blue">Done</Button>
                </Box>
                <Box width="100%">
                  <Button width="calc(100%)" disabled={false} size="xl" type="white">Continue</Button>
                </Box>
              </Box>
            )}
            {!isSent && (
              <Box
                marginTop="40px"
                width="100%"
                display="flex"
              >
                <Box width="50%" paddingRight="7px">
                  <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">Back</Button>
                </Box>
                <Box width="50%" paddingLeft="7px">
                  <Button width="calc(100% - 7px)" disabled={false} size="xl" type="blue" onClick={() => { setIsSending(true); setTimeout(() => { setIsSent(true) }, 2000)}}>Continue</Button>
                </Box>
              </Box>
            )}
          </Fragment>
        )}
      </Box>
    </Box>
  );
}
