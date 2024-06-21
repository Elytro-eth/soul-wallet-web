import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, PopoverTrigger, Link } from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer';
import api from '@/lib/api';
import IconLogo from '@/assets/logo-all-v3.svg';
import { useParams } from 'react-router-dom';
import SuccessIcon from '@/components/Icons/Success';
import ErrorIcon from '@/components/Icons/Error';

const SignHeader = ({ url }: { url?: string }) => {
  return (
    <Box height="58px" pos="absolute" top="0" left={'0'} right={'0'} padding="10px 20px">
      <Link
        display="inline-block"
        {...(url
           ? {
             href: url,
           }
           : {
             cursor: 'default',
        })}
      >
        <Image src={IconLogo} h="44px" />
      </Link>
    </Box>
  );
};

function SignContainer({ children }: any) {
  return (
    <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 58px)"
        flexDirection="column"
        width="100%"
      >
        <Box
          width="1058px"
          maxWidth="100%"
          minHeight="544px"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

export default function VerifySecret() {
  const { secret } = useParams();
  // 0 for loading, 1 for success, 2 for failed
  const [status, setStatus] = useState(0);

  const doConfirm = async () => {
    try{
      const res:any = await api.emailVerify.confirmVerification({ verifySecret: secret });
      console.log('confirm result', res);
      if (res.code === 200&& res.data.verifyResult === 1) {
        setStatus(1);
      } else {
        setStatus(2);
      }
    }catch(e){
      setStatus(2);
    }
  };

  useEffect(() => {
    if (secret) {
      doConfirm();
    }
  }, [secret]);

  if (status === 0) {
    return (
      <SignContainer>
        <Box width={{ base: '100%', md: '100%' }} flex="1" display="flex" padding="60px">
          <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box
              maxWidth="548px"
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box fontSize="32px" fontWeight="700" lineHeight={'normal'}>
                Loading...
              </Box>
            </Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (status === 1) {
    return (
      <SignContainer>
        <Box width={{ base: '100%', md: '100%' }} flex="1" display="flex" padding="60px">
          <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box
              maxWidth="548px"
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                marginBottom="22px"
                width="120px"
                height="120px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <SuccessIcon size="120" />
              </Box>
              <Box fontSize={{ base: '26px', md: '32px' }} fontWeight="700" lineHeight={'normal'}>
                Email verified successfully!
              </Box>
              <Box
                fontSize="14px"
                fontWeight="400"
                lineHeight={'normal'}
                color="black"
                marginTop="34px"
                maxWidth={{ base: '300px', md: '500px' }}
              >
                Your email has been verified. Please continue guardian setup.
              </Box>
            </Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }

  if (status === 2) {
    return (
      <SignContainer>
        <Box width={{ base: '100%', md: '100%' }} flex="1" display="flex" padding="60px">
          <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box
              maxWidth="548px"
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                marginBottom="22px"
                width="120px"
                height="120px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <ErrorIcon size="120" />
              </Box>
              <Box fontSize={{ base: '26px', md: '32px' }} fontWeight="700" lineHeight={'normal'}>
                Failed to verify secret.
              </Box>
            </Box>
          </Box>
        </Box>
      </SignContainer>
    );
  }
}
