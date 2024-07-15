import { Box, Input, Image, useToast } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import LoadingIcon from '@/assets/mobile/loading.gif';
import ReadyIcon from '@/assets/mobile/ready.gif';
import ReadyStaticIcon from '@/assets/mobile/ready_static.svg';
import { useEffect, useRef, useState } from 'react';
import useWallet from '@/hooks/useWallet';
import { Link, useNavigate } from 'react-router-dom';
import RecoverSuccessIcon from '@/assets/recover-success.png'
import useScreenSize from '@/hooks/useScreenSize'

export default function RecoverSuccess({ doRecover, isRecovering }: any) {
  const { innerHeight } = useScreenSize()

  return (
    <Box width="100%" height={innerHeight - 60 - 20} padding="30px" display="flex" alignItems="center" flexDirection="column" justifyContent="center">
      <Box width="144px" height="144px" marginBottom="40px" position="relative">
        <Image height="144px" src={RecoverSuccessIcon} />
      </Box>
      <Box fontWeight="500" fontSize="28px" lineHeight="1" marginBottom="40px" color="#161F36">
        Recovery completed
      </Box>
      {/* <Box width="100%" marginBottom="40px" marginTop="8px">
        <Box fontSize="14px" lineHeight="17.5px" fontWeight="400" textAlign="center" color="#676B75">
          Your account has been recovered. Free to check it out!
        </Box>
      </Box> */}
      <Button width="100%" size="xl" type="gradientBlue" minWidth="195px" onClick={doRecover} loading={isRecovering}>
        Go to account
      </Button>
    </Box>
  );
}
