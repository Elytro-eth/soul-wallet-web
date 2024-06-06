import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import InputAmount from './InputAmount';
import Review from './Review';
import FadeSwitch from '@/components/FadeSwitch';
import { ZeroAddress } from 'ethers';

export default function Send({ isModal }: any) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [tokenAddress, setTokenAddress] = useState(ZeroAddress);

  return (
    <Box width="100%" height="100%">
      <FadeSwitch key={step}>
        <InputAmount
          withdrawAmount={withdrawAmount}
          onWithdrawAmountChange={setWithdrawAmount}
          sendTo={sendTo}
          onSendToChange={setSendTo}
          isModal={true}
        />
      </FadeSwitch>
    </Box>
  )
}
