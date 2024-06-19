import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import SetEmail from './SetEmail';
import ConfirmGuardians from './ConfirmGuardians';
import ConfirmEmail from './ConfirmEmail';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import api from '@/lib/api';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import useTransaction from '@/hooks/useTransaction';
import { SocialRecovery } from '@soulwallet/sdk';
import useWallet from '@/hooks/useWallet';
import { validEmailDomains, validEmailProviders } from '@/config/constants';
import useForm from '@/hooks/useForm';
import { ZeroHash } from 'ethers';
import useScreenSize from '@/hooks/useScreenSize'

const validate = (values: any, props: any, callbackRef: any) => {
  let errors: any = {};
  const { email } = values;

  const emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

  if (!emailReg.test(email)) {
    errors.email = 'Please enter valid email address';
  } else {
    const address = email.split('@')[1];
    console.log('validEmailDomains', validEmailDomains, address);
    if (!validEmailDomains.includes(address)) {
      errors.email = (
        <Box as="p" display="flex">
          <Box as="span" color="danger" marginRight="4px">
            This email provider is not supported.
          </Box>
        </Box>
      );
    }
  }

  if (callbackRef) {
    const externalErrors = callbackRef(values) || {};
    errors = { ...errors, ...externalErrors };
  }

  return errors;
};

export default function VerifyEmail() {
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(0);
  const [verifyExpireTime, setVerifyExpireTime] = useState(0);
  const { selectedChainId } = useChainStore();
  const { selectedAddress } = useAddressStore();
  const { getChangeGuardianOp, signAndSend } = useWallet();
  const [countDown, setCountDown] = useState(0);
  const [changingGuardian, setChangingGuardian] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [countInterval, setCountInterval] = useState<any>();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const screenSize = useScreenSize()
  const innerHeight = screenSize.innerHeight - 134

  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['email'],
    validate,
  });
  const disabled = invalid;

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
    setSendingEmail(true);
    setVerifyStatus(0);
    setVerifyExpireTime(0);
    setVerifyToken('');
    try {
      const res: any = await api.emailVerify.requestVerifyEmail({
        email: values.email,
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
    } catch (err: any) {
      toast({
        title: err.response.data.message || 'Failed to send email',
        status: 'error',
      });
    }finally{
      setSendingEmail(false);
    }
  };

  const startCountDown = () => {
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
  };

  const stopCountDown = () => {
    clearInterval(countInterval);
  }

  const doGenerateAddress = async () => {
    try {
      const res: any = await api.emailGuardian.allocateGuardian({
        email: values.email,
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

  const doBackupGuardian = async (guardianList: any, threshold: number, guardianHash: string) => {
    const res = await api.backup.publicBackupGuardians({
      guardianHash: guardianHash,
      guardianDetails: {
        guardians: guardianList,
        threshold: threshold,
        salt: ZeroHash,
      },
    });
    console.log('backup result', res);
  };

  const doChangeGuardian = async () => {
    setChangingGuardian(true);
    try{
      const defaultThreshold = 1;
      // 1. get guardian address
      const guardianAddress = await doGenerateAddress();
      // 2. calc guardian hash
      const newGuardianHash = SocialRecovery.calcGuardianHash([guardianAddress], defaultThreshold);

      // 3. backup guardian
      await doBackupGuardian([guardianAddress], defaultThreshold, newGuardianHash);

      // 4. get user op
      const userOp = await getChangeGuardianOp(newGuardianHash);
      // 5. execute op
      const res = await signAndSend(userOp);
      navigate('/dashboard');
      toast({
        title: '10 USDC reward received',
        status: 'success',
      });
    }finally{
      setChangingGuardian(false);
    }
  };

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

  const onUseAnotherEmail = async() => {
    stopCountDown();
    setVerifyStatus(0);
    setVerifyExpireTime(0);
    setVerifyToken('');
    setCountDown(0);
    setStep(0);
  }

  const renderStep = () => {
    if (step == 0) {
      return (
        <SetEmail
          email={values.email}
          onChange={onChange('email')}
          onBlur={onBlur('email')}
          errorMsg={showErrors.email && errors.email}
          onSendEmail={onSendEmail}
          sendingEmail={sendingEmail}
          disabled={disabled}
          onPrev={onPrev}
          onSkip={onSkip}
        />
      );
    } else if (step == 1) {
      return verifyToken && verifyStatus === 2 ? (
        <ConfirmGuardians changingGuardian={changingGuardian} onPrev={onPrev} onChangeGuardian={doChangeGuardian} />
      ) : (
        <ConfirmEmail email={values.email} sendingEmail={sendingEmail} onResend={onSendEmail} onPrev={onUseAnotherEmail} onNext={onNext} countDown={countDown} />
      );
    }
  };

  return (
    <Box width="100%" height="100%">
      <Box fontSize="16px" fontWeight="600" padding="10px 30px" paddingTop="60px">Add Email Guardian</Box>
      <Box height={innerHeight}>{renderStep()}</Box>
    </Box>
  );
}
