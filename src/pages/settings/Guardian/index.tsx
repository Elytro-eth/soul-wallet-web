import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate, Outlet } from 'react-router-dom';
import useScreenSize from '@/hooks/useScreenSize'
import Intro from './Intro'
import Manage from './Manage'

export default function GuardianSetting() {
  const { registerForRecover } = usePasskey();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { innerHeight } = useScreenSize()

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

  return (
    <Box width="100%" height={innerHeight}>
      <Header title="Guardian setting" showBackButton onBack={onPrev} />
      <Box
        height={innerHeight - 60}
        overflowY="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Outlet />
      </Box>
    </Box>
  );
}
