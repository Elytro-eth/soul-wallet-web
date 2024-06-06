import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import SetEmail from './SetEmail';
import ConfirmEmail from './ConfirmEmail';
import ConfirmGuardians from './ConfirmGuardians';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar'
import api from '@/lib/api';

export default function VerifyEmail() {
  const { register } = usePasskey();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const toast = useToast();

  const onPrev = useCallback(() => {
    if (step >= 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate('/dashboard')
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
        <SetEmail
          onNext={onNext}
          onPrev={onPrev}
          onSkip={onSkip}
        />
      );
    } else if (step == 1) {
      return <ConfirmEmail onNext={onNext} />;
    } else if (step == 2) {
      return <ConfirmGuardians />;
    }
  };

  return (
    <Box width="100%" height="100%">
      {step < 3 && (
        <Fragment>
          <Header title="Verify email" showBackButton onBack={onPrev} />
        </Fragment>
      )}
      {renderStep()}
    </Box>
  );
}
