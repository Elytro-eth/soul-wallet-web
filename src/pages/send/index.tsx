import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import InputAmount from './InputAmount';
import Review from './Review';
import FadeSwitch from '@/components/FadeSwitch';

export default function Send({ isModal }: any) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [sendTo, setSendTo] = useState('');

  const onPrev = useCallback(() => {
    console.log('prev', step);
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      // navigate('/dashboard');
      navigate(-1)
    }
  }, [step]);

  const onNext = useCallback(() => {
    console.log('next');
    setStep(step + 1);
  }, [step]);

  return (
    <Box width="100%" height="100%">
      <FadeSwitch key={step}>
        {step === 0 && (
          <InputAmount
            withdrawAmount={withdrawAmount}
            onWithdrawAmountChange={setWithdrawAmount}
            sendTo={sendTo}
            onSendToChange={setSendTo}
            onPrev={onPrev}
            onNext={onNext}
            isModal={true}
          />
        )}
        {step === 1 && (
          <Review
            withdrawAmount={withdrawAmount}
            onPrev={onPrev}
            sendTo={sendTo}
            isModal={true}
          />
        )}
      </FadeSwitch>
    </Box>
  )
}
