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
  const [recoverRemainingTime] = useState(0)

  return (
    <Box width="100%" height={innerHeight - 60 - 20} padding="30px" display="flex" alignItems="center" flexDirection="column" justifyContent="center">
      <Box width="144px" height="144px" marginBottom="40px" position="relative">
        <Image height="144px" src={RecoverSuccessIcon} />
      </Box>
      {!!recoverRemainingTime && (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box fontWeight="500" fontSize="28px" lineHeight="1" marginBottom="8px" color="#161F36">
            Account recovering
          </Box>
          <Box fontWeight="400" fontSize="14px" lineHeight="17.5px" marginBottom="40px" color="#676B75" textAlign="center">
            It will take effect in 48 hours. You can access your account after the countdown.
          </Box>
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box
                  width="40px"
                  height="40px"
                  borderRadius="8px"
                  background="radial-gradient(343.44% 424.79% at 35.68% -30.21%, #F0EEE6 0%, #F5EDEB 32.08%, #BAD5F5 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="20px"
                  fontWeight="500"
                  lineHeight="25px"
                >
                  47
                </Box>
                <Box
                  marginTop="3px"
                  fontSize="12px"
                  color="#676B75"
                  lineHeight="15px"
                >
                  Hours
                </Box>
              </Box>
              <Box padding="8px" fontWeight="500" fontSize="20px">:</Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box
                  width="40px"
                  height="40px"
                  borderRadius="8px"
                  background="radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="20px"
                  fontWeight="500"
                  lineHeight="25px"
                >
                  58
                </Box>
                <Box
                  marginTop="3px"
                  fontSize="12px"
                  color="#676B75"
                  lineHeight="15px"
                >
                  minutes
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {!recoverRemainingTime && (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box fontWeight="500" fontSize="28px" lineHeight="1" marginBottom="40px" color="#161F36">
            Account recovered
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
      )}
    </Box>
  );
}
