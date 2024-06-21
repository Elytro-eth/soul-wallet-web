import { Box, Input, Image, useToast } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import LoadingIcon from '@/assets/mobile/loading.gif';
import ReadyIcon from '@/assets/mobile/ready.gif';
import ReadyStaticIcon from '@/assets/mobile/ready_static.svg';
import { useEffect, useRef, useState } from 'react';
import useWallet from '@/hooks/useWallet';
import { Link, useNavigate } from 'react-router-dom';

export default function RecoverSuccess({ doRecover, isRecovering }: any) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimated(true);
    }, 1300);
  }, []);

  return (
    <Box
      width="100%"
      padding="30px"
      height="500px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box width="200px" height="200px" marginBottom="30px" position="relative">
        {!animated && <Image position="absolute" left="0" top="0" width="200px" height="200px" src={ReadyIcon} />}
        <Image position="absolute" left="50px" top="50px" width="100px" height="100px" src={ReadyStaticIcon} />
      </Box>
      <Box fontWeight="700" fontSize="24px" lineHeight="14px" marginBottom="14px">
        Recovery completed
      </Box>
      <Box width="100%" marginBottom="50px" marginTop="14px">
        <Box fontSize="16px" lineHeight="24px" fontWeight="400" textAlign="center">
          Your account has been recovered. Free to check it out!
        </Box>
      </Box>
      <Button width="100%" size="xl" type="blue" minWidth="195px" onClick={doRecover} loading={isRecovering}>
        Go to account
      </Button>
    </Box>
  );
}
