import { Box, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Input, useToast } from '@chakra-ui/react';
import TextBody from '@/components/new/TextBody';
import Title from '@/components/new/Title';
import Button from '@/components/Button';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import useForm from '@/hooks/useForm';
import FormInput from '@/components/new/FormInput';
// import EditGuardianForm from '../EditGuardianForm'

const validate = (values: any) => {
  const errors: any = {};
  const { email } = values;

  const emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

  if (!emailReg.test(email)) {
    errors.email = 'Please enter valid email address';
  } else {
    const address = email.split('@')[1]

    if (address.split('.').indexOf('qq') !== -1) {
      errors.email = 'The email provider is not supported. Please try another';
    }
  }

  return errors;
};

export default function AddEmailGuardianModal({ isOpen, onClose, onConfirm }: any) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  // 1 for sent, 2 for verified
  const [verifyStatus, setVerifyStatus] = useState(0);
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const [verifyExpireTime, setVerifyExpireTime] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const toast = useToast();
  // const onBack = () => {
  //   setIsAddEmailGuardianOpen(false)
  //   if (setIsSelectGuardianOpen) setIsSelectGuardianOpen(true)
  // }

  // const onConfirmLocal = (addresses: any, names: any, i: any) => {
  //   if (onConfirm) onConfirm(addresses, names, i)
  // }

  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['email'],
    validate,
  });

  const disabled = invalid;

  const doSend = async () => {
    setVerifyStatus(0);
    setVerifyExpireTime(0);
    setVerifyToken('');
    setIsSending(true)

    try {
      const email = values.email
      const res: any = await api.emailVerify.requestVerifyEmail({
        email,
        // 1 for binding guardian.
        verifyPurpose: 1,
      });

      console.log('result', res);
      if (res.code === 200) {
        setVerifyToken(res.data.verifyToken);
        setVerifyExpireTime(res.data.verifyExpireTime);
        setVerifyStatus(1);
        toast({
          title: 'A verification email was sent to your email address',
          status: 'success',
        });
      } else {
        toast({
          title: 'Failed to send email',
          status: 'error',
        });
      }

      setIsSending(false)
      startCountDown()
    } catch (err: any) {
      setIsSending(false)
      toast({
        title: err.response.data.message || 'Failed to send email',
        status: 'error',
      });
    }
  };

  const doVerify = async () => {
    const res: any = await api.emailVerify.verificationStatus({
      verifyToken,
    });
    setVerifyStatus(res.data.status);
  };

  const doGenerateAddress = async () => {
    try {
      setIsConfirming(true)
      const email = values.email
      const res: any = await api.emailGuardian.allocateGuardian({
        email,
        verifyToken,
        address: selectedAddress,
        chainID: selectedChainId,
      });

      if (res.code === 200) {
        const guardianAddress = res.data.guardianAddress;
        onConfirm([guardianAddress], ['Email']);
      } else {
        toast({
          title: 'Failed to generate guardian',
          status: 'error',
        });
      }
      setIsConfirming(false)
    } catch (error: any) {
      setIsConfirming(false)
      toast({
        title: 'Failed to generate guardian',
        status: 'error',
      });
      console.log('error', error.message)
    }
  };

  const startCountDown = useCallback(() => {
    let count = 60
    setCountDown(count)

    const interval = setInterval(() => {
      if (!count) {
        setCountDown(0)
        clearInterval(interval)
      } else {
        setCountDown(count--)
      }
    }, 1000)
  }, [])

  const checkEmailValid = () => {
    const emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    setEmailValid(emailReg.test(email));
  };

  useEffect(() => {
    if (!email) {
      return;
    }
    checkEmailValid();
  }, [email]);

  useEffect(() => {
    if (verifyToken) {
      const interval = setInterval(() => {
        doVerify();
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [verifyToken]);

  console.log('disabled', disabled, values, errors)
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: '95%', lg: '840px' }} my={{ base: '120px' }} borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalBody
          overflow="auto"
          padding={{ base: '20px 10px', md: '20px 32px' }}
          marginTop={{ base: '30px', md: '60px' }}
        >
          <Box height="100%" roundedBottom="20px" display="flex">
            <Box width="100%" padding="0 20px">
              <Title fontSize="20px" fontWeight="800">
                Email guardian
              </Title>
              <TextBody fontWeight="500" marginBottom="31px">
                Use email address as your guardian.
              </TextBody>
              <Box>
                <Box width="100%" position="relative">
                  <FormInput
                    label=""
                    placeholder="Email address"
                    value={values.email}
                    onChange={onChange('email')}
                    onBlur={onBlur('email')}
                    errorMsg={showErrors.email && errors.email}
                    _styles={{ w: '100%' }}
                    _inputStyles={{ paddingRight: '110px' }}
                  // onEnter={handleNext}
                  />
                  {!verifyToken && (
                    <Box
                      position="absolute"
                      top="0"
                      height="48px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="800"
                      fontFamily="Nunito"
                      cursor={(!disabled && !isSending) ? 'pointer' : 'not-allowed'}
                      zIndex="1"
                      {...((!disabled && !isSending)
                         ? { onClick: doSend, color: 'brand.red' }
                         : {
                           color: 'rgba(0, 0, 0, 0.3)',
                      })}
                    >
                      {isSending ? 'Sending' : 'Verify email'}
                    </Box>
                  )}
                  {(verifyToken && verifyStatus === 1) && (
                    <Box
                      position="absolute"
                      top="0"
                      height="48px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontFamily="Nunito"
                      color={countDown ? 'rgba(0, 0, 0, 0.4)' : '#FF2E79'}
                      cursor={!countDown ? 'pointer' : 'not-allowed'}
                      zIndex="1"
                      onClick={countDown ? (() => {}) : doSend}
                    >
                      {!countDown ? 'Resend' : `Resend in ${countDown}s`}
                    </Box>
                  )}
                  {(verifyToken && verifyStatus === 2) && (
                    <Box
                      position="absolute"
                      top="0"
                      height="48px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontFamily="Nunito"
                      color="#0DC800"
                      cursor="pointer"
                      zIndex="1"
                    >
                      <Box marginRight="4px">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.74316 9.00014L3.24316 6.17934L2 7.50014L5.74316 11.838L13 3.00014L11.7432 1.67934L5.74316 9.00014Z"
                            fill="#0DC800"
                          />
                        </svg>
                      </Box>
                      Verified
                    </Box>
                  )}
                </Box>
                {/* <Box
                    width="100%"
                    color="#E83D26"
                    fontWeight="600"
                    fontSize="14px"
                    marginTop="4px"
                    paddingLeft="16px"
                    >
                    The email provider is not supported. Please try another
                    </Box> */}
                <Box marginTop="68px" marginBottom="10px" display="flex" justifyContent="flex-end">
                  <Box>
                    <Button type="black" disabled={isConfirming} onClick={doGenerateAddress} size="xl">
                      {isConfirming ? 'Confirming' : 'Confirm'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
