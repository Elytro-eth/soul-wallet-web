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
import { Link } from 'react-router-dom';

export default function PayRecoveryFee({ next }: any) {
  const { recoverInfo } = useTempStore();
  const { recoveryID } = recoverInfo;
  const { boostAfterRecovered } = useWallet();
  const [isRecovering, setIsRecovering] = useState(false);
  const [isRecovered, setIsRecovered] = useState(false);

  const doRecover = async () => {
    while (true) {
      setIsRecovering(true);
      const res:any = await api.recovery.execute({ recoveryID });
      if (res.msg === 'executeRecovery tirggered' || res.msg === 'already executed') {
        const res = (await api.guardian.getRecoverRecord({ recoveryID })).data;
        await boostAfterRecovered(res);
        setIsRecovered(true);
        break;
      }
    }
  };

  useEffect(()=>{
    if(!recoverInfo || !recoverInfo.recoveryID){
      setIsRecovered(true)
    }
  }, [recoverInfo.recoveryID])

  if (isRecovered) {
    return (
      <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader url="/auth" />
        <Box
          padding="20px"
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          minHeight="calc(100% - 58px)"
          width="100%"
          paddingTop="60px"
          flexDirection={{ base: 'column', md: 'row' }}
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
              <Link to="/dashboard">
                <Button size="lg" fontSize="18px" width="260px">
                  Go to Wallet
                </Button>
              </Link>
            </Box>
          </RoundContainer>
          <StepProgress activeIndex={3} />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader url="/auth" />
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
        width="100%"
        paddingTop="60px"
        flexDirection={{ base: 'column', md: 'row' }}
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
              Soul Wallet is sponsored the recovery fee for you. Please click the button below to confirm the recovery.
            </TextBody>
            <Button size="lg" fontSize="18px" width="260px" onClick={doRecover} disabled={isRecovering}>
              {isRecovering ? 'Recovering' : 'Confirm recovery'}
            </Button>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={3} />
      </Box>
    </Flex>
  );
}
