import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import SetAddress from './SetAddress';
import SetAmount from './SetAmount';
import Review from './Review';
import FadeSwitch from '@/components/FadeSwitch';
import { ZeroAddress } from 'ethers';

export default function Send({ isModal }: any) {
  const [step, setStep] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState<any>('');
  const [sendTo, setSendTo] = useState('');

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
    <Box width="100%" height="100%">
      <FadeSwitch key={step}>
        {step === 0 && <SetAddress isModal={true} onNext={onNext} />}
        {step === 1 && <SetAmount isModal={true} withdrawAmount={withdrawAmount} setWithdrawAmount={setWithdrawAmount} sendTo={sendTo} setSendTo={setSendTo}  onPrev={onPrev} onNext={onNext} />}
        {step === 2 && <Review isModal={true} onPrev={onPrev} />}
      </FadeSwitch>
    </Box>
  )
}
