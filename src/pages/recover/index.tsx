import { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import { Box, Image, Flex, useToast } from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
import { useTempStore } from '@/store/temp';
import RecoverWalletIcon from '@/assets/icons/recover-wallet.svg';
import SetWalletAddress from './SetWalletAddress';
import AddSigner from './AddSigner';
import api from '@/lib/api';
import GuardianApprovals from './GuardianApprovals';
import PayRecoveryFee from './PayRecoveryFee';
import RecoverProgress from './RecoverProgress';
import { SignHeader } from '../public/Sign';
import useQuery from '@/hooks/useQuery';

export function RecoveryContainer({ children }: any) {
  return (
    <Flex align={'flex-start'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader url="/auth" />
      {children}
    </Flex>
  );
}

export default function Recover() {
  const [step, setStep] = useState(0);
  const { navigate } = useBrowser();
  const {getRecoverRecord} = useQuery();
  const { recoverInfo, updateRecoverInfo } = useTempStore();
  const { recoveryID } = recoverInfo;

  const back = useCallback(() => {
    console.log('step', step);
    if (step === 0) {
      navigate(`/auth`);
    } else {
      setStep(step - 1);
    }
  }, [step]);

  const next = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const getPreviousRecord = async () => {
    try {
      const recoveryRecord = await getRecoverRecord(recoveryID);

      updateRecoverInfo({
        recoveryRecord,
        // enabled: false,
      });

      const status = recoveryRecord.status;

      if (status == 0) {
        // record submitted
        setStep(3);
      } else if (status == 1) {
        // signatured gathered
        setStep(4);
      }
    } catch (error: any) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    if (recoveryID) {
      getPreviousRecord();
      const interval = setInterval(async () => {
        getPreviousRecord();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [recoveryID]);

  // useEffect(() => {
  //   if (recoveryID) {
  //     const status = recoveryRecord.status

  //     if (status == 0) {
  //       setStep(3)
  //     } else if (status == 1) {
  //       setStep(4)
  //     }
  //     //  else if (status >= 2) {
  //     //   setStep(5)
  //     // }
  //   }
  // }, [])

  if (step === 1) {
    return <SetWalletAddress next={next} back={back} />;
  }

  if (step === 2) {
    return <AddSigner next={next} back={back} />;
  }

  if (step === 3) {
    return <GuardianApprovals />;
  }

  if (step === 4) {
    return <PayRecoveryFee />;
  }

  // if (step > 4) {
  //   return (
  //     <RecoverProgress />
  //   )
  // }

  return (
    <RecoveryContainer>
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="calc(100% - 58px)"
        flexDirection="column"
        paddingTop="60px"
        width="100%"
        marginTop="60px"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '84px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box width="120px" height="120px" borderRadius="120px" background="#D9D9D9" marginBottom="20px">
              <Image src={RecoverWalletIcon} width="120px" height="120px" />
            </Box>
            <Heading marginBottom="18px" type="h3" fontSize={{ base: '24px', lg: '32px' }}>
              Recover my wallet
            </Heading>
            <TextBody fontWeight="600" maxWidth="550px" textAlign="center" marginBottom="20px">
              We understand it must be annoying to lose wallet. No worries, we got you covered! Just simply recovery
              your wallet within{' '}
              <Box as="span" fontWeight="bold">
                4 steps
              </Box>
              .
            </TextBody>
            <Box>
              <Button width="80px" type="white" marginRight="18px" onClick={back} size="xl">
                Back
              </Button>
              <Button width="135px" maxWidth="100%" type="black" onClick={next} size="xl">
                Get started
              </Button>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </RecoveryContainer>
  );
}
