import { Box, Input, Image, useToast } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import LoadingIcon from '@/assets/mobile/loading.gif';
import ReadyIcon from '@/assets/mobile/ready.gif';
import ReadyStaticIcon from '@/assets/mobile/ready_static.svg';
import { useEffect, useRef, useState } from 'react';
import useWallet from '@/hooks/useWallet';
import { Link, useNavigate } from 'react-router-dom';
import RecoverSuccessIcon from '@/assets/recover-success.png';
import useScreenSize from '@/hooks/useScreenSize';
import { useTempStore } from '@/store/temp';

export default function RecoverSuccess({ doRecover, doPastRecover, isRecovering }: any) {
  const { innerHeight } = useScreenSize();
  const { recoverInfo } = useTempStore();
  const [remainingHours, setRemainingHours] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [reachedValidTime, setReachedValidTime] = useState(false);

  const validTime = recoverInfo.validTime;

  console.log('valid time!!!!', validTime)

  /**
   *
   * @returns Calculate the remaining time return hour and minutes
   */
  const calculateReamingTime = () => {
    const now = new Date().getTime() / 1000;
    const remainingTime = validTime - now;
    console.log('rema', remainingTime, validTime);
    if (validTime > 1 && remainingTime <= 0) {
      setReachedValidTime(true);
    } else {
      setReachedValidTime(false);
      const hours = Math.floor(remainingTime / 3600);
      setRemainingHours(hours);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      setRemainingMinutes(minutes);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      calculateReamingTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      width="100%"
      height={innerHeight - 60 - 20}
      padding="30px"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <Box width="144px" height="144px" marginBottom="40px" position="relative">
        <Image height="144px" src={RecoverSuccessIcon} />
      </Box>
      {validTime >= 1 ? (
        <>
          {reachedValidTime ? (
            <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <Box fontWeight="500" fontSize="28px" lineHeight="1" marginBottom="40px" color="#161F36">
                Account recovered
              </Box>
              <Button width="100%" size="xl" type="gradientBlue" minWidth="195px" onClick={doPastRecover}>
                Go to account
              </Button>
            </Box>
          ) : (
            <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <Box fontWeight="500" fontSize="28px" lineHeight="1" marginBottom="8px" color="#161F36">
                Account recovering
              </Box>
              <Box
                fontWeight="400"
                fontSize="14px"
                lineHeight="17.5px"
                marginBottom="40px"
                color="#676B75"
                textAlign="center"
              >
                It will take effect in 48 hours. You can access your account after the countdown.
              </Box>
              <Box width="100%" display="flex" alignItems="center" justifyContent="center">
                <Box display="flex" alignItems="flex-start" justifyContent="center">
                  <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
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
                      {remainingHours}
                    </Box>
                    <Box marginTop="3px" fontSize="12px" color="#676B75" lineHeight="15px">
                      Hours
                    </Box>
                  </Box>
                  <Box padding="8px" fontWeight="500" fontSize="20px">
                    :
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
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
                      {remainingMinutes}
                    </Box>
                    <Box marginTop="3px" fontSize="12px" color="#676B75" lineHeight="15px">
                      minutes
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Box fontWeight="500" fontSize="28px" lineHeight="1" marginBottom="40px" color="#161F36">
            You can recover account now
          </Box>
          <Button
            width="100%"
            size="xl"
            type="gradientBlue"
            minWidth="195px"
            onClick={doRecover}
            loading={isRecovering}
          >
            Recover
          </Button>
        </Box>
      )}
    </Box>
  );
}
