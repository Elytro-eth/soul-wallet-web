import { Box, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Input, useToast } from '@chakra-ui/react';
import TextBody from '@/components/new/TextBody';
import Title from '@/components/new/Title';
import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
// import EditGuardianForm from '../EditGuardianForm'

export default function AddEmailGuardianModal({ isOpen, onClose, onConfirm }: any) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  // 1 for sent, 2 for verified
  const [verifyStatus, setVerifyStatus] = useState(0);
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const [verifyExpireTime, setVerifyExpireTime] = useState(0);
  const toast = useToast();
  // const onBack = () => {
  //   setIsAddEmailGuardianOpen(false)
  //   if (setIsSelectGuardianOpen) setIsSelectGuardianOpen(true)
  // }

  // const onConfirmLocal = (addresses: any, names: any, i: any) => {
  //   if (onConfirm) onConfirm(addresses, names, i)
  // }
  const doSend = async () => {
    setVerifyStatus(0);
    setVerifyExpireTime(0);
    setVerifyToken('');

    try {
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
          title: 'Email sent',
          status: 'success',
        });
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
    }
  };

  const doVerify = async () => {
    const res: any = await api.emailVerify.verificationStatus({
      verifyToken,
    });
    setVerifyStatus(res.data.status);
  };

  const doGenerateAddress = async () => {
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
  };

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
                  <Input
                    height="44px"
                    type="text"
                    placeholder="Email address"
                    paddingRight="110px"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {!verifyToken && (
                    <Box
                      position="absolute"
                      top="0"
                      height="44px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="800"
                      fontFamily="Nunito"
                      cursor="pointer"
                      zIndex="1"
                      {...(emailValid
                        ? { onClick: doSend, color: 'brand.red' }
                        : {
                            color: 'rgba(0, 0, 0, 0.3)',
                          })}
                    >
                      Verify email
                    </Box>
                  )}
                  {verifyStatus === 1 && (
                    <Box
                      position="absolute"
                      top="0"
                      height="44px"
                      right="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      fontFamily="Nunito"
                      color="#FF2E79"
                      cursor="pointer"
                      zIndex="1"
                      onClick={doSend}
                    >
                      Resend
                    </Box>
                  )}
                  {verifyStatus === 2 && (
                    <Box
                      position="absolute"
                      top="0"
                      height="44px"
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
                    <Button type="black" onClick={doGenerateAddress} size="xl">
                      Confirm
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
