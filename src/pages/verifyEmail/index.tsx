import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import SetEmail from './SetEmail';
import ConfirmEmail from './ConfirmEmail';
import ConfirmGuardians from './ConfirmGuardians';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import useWallet from '@/hooks/useWallet';
import { validEmailDomains, validEmailProviders } from '@/config/constants';
import useForm from '@/hooks/useForm';
import useScreenSize from '@/hooks/useScreenSize';
import useRecover from '@/hooks/useRecover';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useSettingStore } from '@/store/setting';

const validate = (values: any, props: any, callbackRef: any) => {
  let errors: any = {};
  const { email } = values;

  const emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

  if (!emailReg.test(email)) {
    errors.email = 'Please enter valid email address';
  } else {
    const address = email.split('@')[1].toLowerCase();
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

export default function VerifyEmail({ isModal, callback, defaultEmail, }: any) {
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(0);
  const [verifyExpireTime, setVerifyExpireTime] = useState(0);
  const { selectedChainId } = useChainStore();
  const { closeModal } = useWalletContext();
  const { guardianAddressEmail,} = useSettingStore();
  const { selectedAddress } = useAddressStore();
  const { doSetGuardians } = useRecover();
  const [countDown, setCountDown] = useState(0);
  const [changingGuardian, setChangingGuardian] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [countInterval, setCountInterval] = useState<any>();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { innerHeight } = useScreenSize();

  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['email'],
    validate,
    initialValues: [defaultEmail || '']
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
    } finally {
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
  };

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
          // important todo, backend handle this.
          // toast({
          //   title: 'Email is already added.',
          //   status: 'error',
          // });
          return res.data.guardianAddress;
        }
        return res.data.guardianAddress;
      } else {
        toast({
          title: 'Failed to generate recovery contact',
          status: 'error',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Failed to generate recovery contact',
        status: 'error',
      });
      console.log('error', error.message);
    }
  };

  const doChangeGuardian = async () => {
    setChangingGuardian(true);
    try {
      const guardianAddress = await doGenerateAddress();
      if(callback){
        callback(guardianAddress, values.email);
      }else{
        const defaultThreshold = 1;
        await doSetGuardians([guardianAddress], [values.email], defaultThreshold);
        console.log('1111')
        if(isModal){
        console.log('2222')

          closeModal();
        }else{
        console.log('3333')

          toast({
            title: '10 USDC reward received',
            status: 'success',
          });
          navigate('/dashboard');
        }
      }
    } finally {
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

  const onUseAnotherEmail = async () => {
    stopCountDown();
    setVerifyStatus(0);
    setVerifyExpireTime(0);
    setVerifyToken('');
    setCountDown(0);
    setStep(0);
  };

  const renderStep = (isModal: boolean) => {
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
          isModal={isModal}
        />
      );
    } else if (step == 1) {
      return (verifyToken && (verifyStatus === 2 || verifyStatus === 3)) ? (
        <ConfirmGuardians
          changingGuardian={changingGuardian}
          onPrev={onPrev}
          onChangeGuardian={doChangeGuardian}
          isModal={isModal}
        />
      ) : (
        <ConfirmEmail
          email={values.email}
          sendingEmail={sendingEmail}
          onResend={onSendEmail}
          onPrev={onUseAnotherEmail}
          onNext={onNext}
          countDown={countDown}
          isModal={isModal}
        />
      );
    }
  };

  return (
    <Box width="100%" bg="#fff" height={isModal ? '100%' : innerHeight}>
      {!isModal && step < 3 && (
        <Fragment>
          <Header title="Verify email" showBackButton onBack={onPrev} />
        </Fragment>
      )}
      {isModal && (
        <Box fontSize="16px" fontWeight="500" padding="10px 30px" paddingTop="60px">
          Add Email Recovery Contact
        </Box>
      )}
      <Box
        height={isModal ? innerHeight - 134 : innerHeight - 60}
        overflowY="auto"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
      >
        {renderStep(isModal)}
      </Box>
    </Box>
  );
}
