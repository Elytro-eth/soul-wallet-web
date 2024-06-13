import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import Intro from './Intro'

export default function GuardianSetting() {
  const { registerForRecover } = usePasskey();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const onPrev = useCallback(() => {
    if (step >= 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  }, [step]);

  const onNext = useCallback(() => {
    console.log('next');
    setStep(step + 1);
  }, [step]);

  const renderStep = () => {
    if (step == 0) {
      return (
        <Intro onPrev={onPrev} onNext={onNext} />
      )
    }

    return null
  };

  return (
    <Box width="100%" height="100%">
      <Header title="Guardian setting" showBackButton onBack={onPrev} />
      {renderStep()}
    </Box>
  );
}
