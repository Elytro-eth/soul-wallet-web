import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import SetAddress from './SetAddress';
import SetAmount from './SetAmount';
import Review from '@/components/Review';
import useScreenSize from '@/hooks/useScreenSize'

export default function Send({ isModal }: any) {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState<any>('');
  const [sendTo, setSendTo] = useState('');
  const [tokenAddress, setTokenAddress] = useState();
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const { innerHeight } = useScreenSize()

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

  return (
    <Box
      width="100%"
      height={innerHeight}
      display="flex"
      padding={{
        sm: '0',
        md: '72px'
      }}
    >
      <Box
        width="380px"
        display={{
          sm: 'none',
          md: 'flex'
        }}
        flexDirection="column"
        marginTop="64px"
      >
        <Box
          fontSize="14px"
          lineHeight="17.5px"
          marginBottom="18px"
          paddingLeft="12px"
          fontWeight={step === 0 ? '500' : '400'}
          color={step === 0 ? '#161F36' : '#676B75'}
          borderLeft={step === 0 ? '2px solid #161F36' : '2px solid transparent'}
        >
          Recipient
        </Box>
        <Box
          fontSize="14px"
          lineHeight="17.5px"
          marginBottom="18px"
          paddingLeft="12px"
          fontWeight={step === 1 ? '500' : '400'}
          color={step === 1 ? '#161F36' : '#676B75'}
          borderLeft={step === 1 ? '2px solid #161F36' : '2px solid transparent'}
        >
          Amount
        </Box>
        <Box
          fontSize="14px"
          lineHeight="17.5px"
          marginBottom="18px"
          paddingLeft="12px"
          fontWeight={step === 2 ? '500' : '400'}
          color={step === 2 ? '#161F36' : '#676B75'}
          borderLeft={step === 2 ? '2px solid #161F36' : '2px solid transparent'}
        >
          Review
        </Box>
      </Box>
      <Box
        width={{
          sm: '100%',
          md: '480px'
        }}
      >
        <Box width="100%">
          {step === 0 && <SetAddress isModal={true} onNext={onNext} sendTo={sendTo} setSendTo={setSendTo} />}
          {step === 1 && <SetAmount isModal={true} amount={amount} setAmount={setAmount} onPrev={onPrev} onNext={onNext} tokenAddress={tokenAddress} setTokenAddress={setTokenAddress} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />}
          {step === 2 && <Review amount={amount} selectedToken={selectedToken} sendTo={sendTo} tokenAddress={tokenAddress} isModal={true} onPrev={onPrev} />}
        </Box>
      </Box>
    </Box>
  )
}
