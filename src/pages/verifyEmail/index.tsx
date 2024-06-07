import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import SetEmail from './SetEmail';
import ConfirmEmail from './ConfirmEmail';
import ConfirmGuardians from './ConfirmGuardians';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import api from '@/lib/api';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import useTransaction from '@/hooks/useTransaction';
import { SocialRecovery } from '@soulwallet/sdk';
import useWallet from '@/hooks/useWallet';
import useNavigation from '@/hooks/useNavigation';

export default function VerifyEmail() {
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(0);
  const [verifyExpireTime, setVerifyExpireTime] = useState(0);
  const {selectedChainId } = useChainStore();
  const {selectedAddress} = useAddressStore();
  const {getChangeGuardianOp, signAndSend} = useWallet();
  const [countDown, setCountDown] = useState(0);
  const [countInterval, setCountInterval] = useState<any>();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(0);

  const onPrev = useCallback(() => {
    if (step >= 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate('/dashboard');
    }
  }, [step]);

  const onNext = useCallback(() => {
    console.log('next');
    setStep(step + 1);
  }, [step]);

  const onSendEmail = async () => {
    setVerifyStatus(0);
    setVerifyExpireTime(0);
    setVerifyToken('');
    try{
      const res: any = await api.emailVerify.requestVerifyEmail({
        email,
        // 1 for binding guardian.
        verifyPurpose: 1,
      });
  
      if (res.code === 200) {
        setVerifyToken(res.data.verifyToken);
        setVerifyExpireTime(res.data.verifyExpireTime);
        setVerifyStatus(1);
        setStep(1);
        toast({
          title: 'A verification email was sent to your email address',
          status: 'success',
        });
      startCountDown();

      } else {
        toast({
          title: 'Failed to send email',
          status: 'error',
        });
      }
    }catch(err:any){
      toast({
        title: err.response.data.message || 'Failed to send email',
        status: 'error',
      });
    }
  };

  const startCountDown = useCallback(() => {
    let count = 60;
    setCountDown(count);

    const interval = setInterval(() => {
      if (!count) {
        setCountDown(0);
        clearInterval(interval);
      } else {
        setCountDown(count--);
      }
    }, 1000);

    setCountInterval(interval);
  }, []);

  const doGenerateAddress = async () => {
    try {
      const res: any = await api.emailGuardian.allocateGuardian({
        email,
        verifyToken,
        address: selectedAddress,
        chainID: selectedChainId,
      });

      if (res.code === 200) {
        if (res.msg === 'already allocated') {
          toast({
            title: 'Email is already added.',
            status: 'error',
          });
          return;
        }
        return res.data.guardianAddress;
      } else {
        toast({
          title: 'Failed to generate guardian',
          status: 'error',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Failed to generate guardian',
        status: 'error',
      });
      console.log('error', error.message);
    }
  };

  const doChangeGuardian = async () => {
    // 1. get guardian address
    const guardianAddress = await doGenerateAddress();
    // 2. calc guardian hash
    const newGuardianHash = SocialRecovery.calcGuardianHash([guardianAddress], 1);
    // 3. get user op
    const userOp = await getChangeGuardianOp(newGuardianHash);
    // 4. execute op
    const res = await signAndSend(userOp);
    navigate('/dashboard');
    toast({
      title: "10 USDC reward received",
      status: "success",
    })
  }

  const checkVerify = async () => {
    const res: any = await api.emailVerify.verificationStatus({
      verifyToken,
    });
    setVerifyStatus(res.data.status);
  };

  useEffect(() => {
    if (verifyToken) {
      const interval = setInterval(() => {
        checkVerify();
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [verifyToken]);

  const onSkip = useCallback(() => {
    console.log('skip');
  }, []);

  const renderStep = () => {
    if (step == 0) {
      return <SetEmail email={email} setEmail={setEmail} onSendEmail={onSendEmail} onPrev={onPrev} onSkip={onSkip} />;
    } else if (step == 1) {
      return verifyToken && verifyStatus === 2 ? <ConfirmGuardians onPrev={onPrev} onChangeGuardian={doChangeGuardian} /> : <ConfirmEmail email={email} onPrev={onPrev} onNext={onNext} />
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
