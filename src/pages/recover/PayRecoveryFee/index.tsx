import { useState, useCallback, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { SignHeader } from '@/pages/public/Sign';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
import { useTempStore } from '@/store/temp';
import RecoverCheckedIcon from '@/components/Icons/RecoverChecked';
import StepProgress from '../StepProgress';
import api from '@/lib/api';
import useWallet from '@/hooks/useWallet';
import { Link, useNavigate } from 'react-router-dom';
import { RecoveryContainer } from '@/pages/recover';

export default function PayRecoveryFee() {
  const { recoverInfo, clearTempStore, } = useTempStore();
  const { recoveryID } = recoverInfo;
  const { boostAfterRecovered } = useWallet();
  const navigate = useNavigate();
  const [isRecovering, setIsRecovering] = useState(false);
  const [isRecovered, setIsRecovered] = useState(false);

  const doRecover = async () => {
    while (true) {
      setIsRecovering(true);
      const res: any = await api.recovery.execute({ recoveryID });
      if (res.msg === 'executeRecovery tirggered' || res.msg === 'already executed') {
        const res = (await api.guardian.getRecoverRecord({ recoveryID })).data;
        await boostAfterRecovered(res);
        setIsRecovered(true);
        break;
      }
    }
  };

  useEffect(() => {
    if (!recoverInfo || !recoverInfo.recoveryID) {
      setIsRecovered(true);
    }
  }, [recoverInfo.recoveryID]);

  const goWallet = () => {
    clearTempStore();
    navigate('/dashboard')
  }

  if (isRecovered) {
    return (
      <RecoveryContainer>
        <Box
          padding="20px"
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          minHeight="calc(100% - 58px)"
          width="100%"
          paddingTop="60px"
          flexDirection={{ base: 'column', md: 'row' }}
          marginTop="33px"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            background="white"
            marginBottom="20px"
          >
            <Box
              width="100%"
              height="100%"
              padding={{ base: '20px', md: '50px' }}
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading marginBottom="18px" type="h4" fontSize="24px" fontWeight="700">
                Step 4/4: Recovery
              </Heading>
              <TextBody
                fontWeight="500"
                maxWidth="650px"
                marginBottom="20px"
                width="100%"
                wordBreak="break-all"
                fontSize="16px"
                display="flex"
                alignItems="center"
              >
                <RecoverCheckedIcon />
                <Box>Your wallet has been recovered. Free to check it out!</Box>
              </TextBody>
                <Button size="lg" fontSize="18px" width="260px" onClick={goWallet}>
                  Go to Wallet
                </Button>
            </Box>
          </RoundContainer>
          <StepProgress activeIndex={3} />
        </Box>
      </RecoveryContainer>
    );
  }

  return (
    <RecoveryContainer>
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
        width="100%"
        paddingTop="60px"
        flexDirection={{ base: 'column', md: 'row' }}
        marginTop="33px"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
          marginBottom="20px"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '50px' }}
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading marginBottom="18px" type="h4" fontSize="24px" fontWeight="700">
              Step 4/4: Recovery
            </Heading>
            <TextBody
              fontWeight="500"
              maxWidth="650px"
              marginBottom="20px"
              width="100%"
              wordBreak="break-all"
              fontSize="16px"
            >
              Soul Wallet has sponsored the recovery fee for you. Please click the button below to confirm the recovery.
            </TextBody>
            {isRecovering ? (
              <Button
                loading={true}
                size="lg"
                fontSize="18px"
                width="260px"
                onClick={doRecover}
                disabled={isRecovering}
              >
                Recovering
              </Button>
            ) : (
              <Button size="lg" fontSize="18px" width="260px" onClick={doRecover} disabled={isRecovering}>
                Confirm recovery
              </Button>
            )}
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={3} />
      </Box>
    </RecoveryContainer>
  );
}
