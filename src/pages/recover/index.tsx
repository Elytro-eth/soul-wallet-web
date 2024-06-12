import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar'
import Intro from './Intro'
import SetUsername from './SetUsername'
import SetPasskey from './SetPasskey'
import RecoverProgress from './RecoverProgress'
import api from '@/lib/api';

export default function Recover() {
  const { register } = usePasskey();
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

  const onSkip = useCallback(() => {
    console.log('skip');
  }, []);

  const renderStep = () => {
    if (step == 0) {
      return (
        <Intro onPrev={onPrev} onNext={onNext} />
      )
    } else if (step == 1) {
      return (
        <SetUsername onPrev={onPrev} onNext={onNext} />
      )
    } else if (step == 2) {
      return (
        <SetPasskey onPrev={onPrev} onNext={onNext} />
      )
    } else if (step == 3) {
      return (
        <RecoverProgress onNext={onNext} />
      )
    }

    return null
  };

  return (
    <Box width="100%" height="100%">
      {step < 4 && (
        <Fragment>
          {step === 0 && (
            <Header title="" showLogo={true} />
          )}
          {step > 0 && (
            <Header title="Recover account" showBackButton onBack={onPrev} />
          )}
        </Fragment>
      )}
      {renderStep()}
    </Box>
  );
}
