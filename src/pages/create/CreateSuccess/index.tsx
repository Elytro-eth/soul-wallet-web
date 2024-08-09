import { Box, Input, Image, useToast } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import LoadingIcon from '@/assets/mobile/loading.gif';
import ReadyIcon from '@/assets/mobile/ready.gif';
import ReadyStaticIcon from '@/assets/mobile/ready_static.svg';
import { useEffect, useRef, useState } from 'react';
import useWallet from '@/hooks/useWallet';
import { Link, useNavigate } from 'react-router-dom';
import useBrowser from '@/hooks/useBrowser';
import useScreenSize from '@/hooks/useScreenSize'
import WelcomeIcon from '@/assets/account-ready.png'

export default function CreateSuccess({ credential, username, invitationCode }: any) {
  const { getActivateOp, signAndSend } = useWallet();
  const { navigate } = useBrowser();
  const userOpRef = useRef<any>();
  const initialKeysRef = useRef<any>();
  const creatingRef = useRef(false);
  const executingRef = useRef(false);
  const { innerHeight } = useScreenSize()

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimated(true);
    }, 1300);
  }, []);

  const prepareAction = async () => {
    try {
      if (!initialKeysRef.current) {
        // const { initialKeys: _initialKeys } = await initWallet(credential, username, invitationCode);
        // initialKeysRef.current = _initialKeys;
        // const _userOp = await getActivateOp(_initialKeys);
        // userOpRef.current = _userOp;
      } else {
        const _userOp = await getActivateOp(initialKeysRef.current);
        userOpRef.current = _userOp;
      }
    } catch (e) {
      creatingRef.current = false;
      executingRef.current = false;
    }
  };

  useEffect(() => {
    prepareAction();
    const interval = setInterval(() => {
      if (creatingRef.current) {
        return;
      }
      prepareAction();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // const onCreate = async (skipExecutingCheck = false) => {
  //   creatingRef.current = true;
  //   if (executingRef.current && !skipExecutingCheck) {
  //     return;
  //   }
  //   executingRef.current = true;
  //   if (userOpRef.current) {
  //     try {
  //       await signAndSend(userOpRef.current);
  //       executingRef.current = false;
  //       // setExecuting(false);
  //       navigate('/intro');
  //     } catch (error: any) {
  //       toast({
  //         title: 'Failed to create wallet',
  //         description: error.message,
  //         status: 'error',
  //       });
  //       creatingRef.current = false;
  //       executingRef.current = false;
  //       // setExecuting(false);
  //     }
  //   } else {
  //     creatingRef.current = false;
  //     setTimeout(() => {
  //       onCreate(true);
  //     }, 1000);
  //   }
  // };

  if (creatingRef.current) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="linear-gradient(180deg, #FBFBFB 0%, #F0F0F0 100%)"
      >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box>
            <Image width="80px" height="80px" src={LoadingIcon} />
          </Box>
          <Box marginTop="18px" fontWeight="400" fontSize="18px" lineHeight="14px" marginBottom="14px">
            Setting up wallet...
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      padding="30px"
      height={{
        sm: innerHeight,
        md: 'auto',
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box marginBottom="40px">
        <Image height="198px" src={WelcomeIcon} />
      </Box>
      <Box fontWeight="500" fontSize="24px" lineHeight="14px" marginBottom="32px">
        Your account is ready
      </Box>
      <Box style={{width: "100%"}} >
        <Button width="100%" size="xl" type="gradientBlue" minWidth="195px" onClick={() => navigate('/dashboard')}>
          Let’s go
        </Button>
      </Box>
      <Box height="100px" display={{ sm: 'block', md: 'none' }} />
    </Box>
  );
}
