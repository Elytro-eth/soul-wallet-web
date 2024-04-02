import { Box, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import Header from '@/components/mobile/Header';
// import CompletedIcon from '@/components/Icons/mobile/Completed';
import { Link } from 'react-router-dom';
import LoadingIcon from '@/assets/mobile/loading.gif';
import CompletedIcon from '@/assets/mobile/completed.gif';
import CompletedStaticIcon from '@/assets/mobile/completed_static.svg';
import { useEffect, useRef, useState } from 'react';
import useWallet from '@/hooks/useWallet';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function Review({ onPrev, withdrawAmount, sendTo, isModal }: any) {
  const { closeModal } = useWalletContext()
  const { getWithdrawOp, signAndSend } = useWallet();
  const executingRef = useRef(false);
  const userOpRef = useRef();
  const isCompletedRef = useRef(false);
  const isTransferingRef = useRef(false);

  const [animated, setAnimated] = useState(false)
  const [completed, setCompleted] = useState(false)

  const prepareAction = async () => {
    try {
      const _userOp = await getWithdrawOp(withdrawAmount, sendTo);
      userOpRef.current = _userOp;
    } catch (e) {
      // user may reach limit of gas sponsor
      executingRef.current = false;
      isTransferingRef.current = false;
      closeModal();
    }
  };

  useEffect(() => {
    prepareAction();
    const interval = setInterval(() => {
      if (isTransferingRef.current || isCompletedRef.current) {
        return;
      }
      prepareAction();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const onWithdraw = async (skipExecutingCheck = false) => {
    isTransferingRef.current = true;
    if (executingRef.current && !skipExecutingCheck) {
      return;
    }
    executingRef.current = true;
    isTransferingRef.current = true;
    if (userOpRef.current) {
      try {
        await signAndSend(userOpRef.current);
        isTransferingRef.current = false;
        isCompletedRef.current = true;
        setAnimated(false)
        setCompleted(true)
        console.log('setAnimated false')

        setTimeout(() => {
          setAnimated(true)
          console.log('setAnimated true')
        }, 1300)
      } catch (e) {
        // setExecuting(false);
        executingRef.current = false;
        isTransferingRef.current = false;
        isCompletedRef.current = false;
      }
    } else {
      executingRef.current = false;
      setTimeout(() => {
        onWithdraw(true);
      }, 1000);
    }
  };

  return (
    <Box width="100%" maxWidth="100vw" height="100%">
      <Header title="Review" showBackButton onBack={onPrev} />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        {isTransferingRef.current && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="200px"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <Box marginBottom="6px" marginTop="20px">
              <Image width="80px" height="80px" src={LoadingIcon} />
            </Box>
            <Box>Transfer in progress</Box>
          </Box>
        )}
        {isCompletedRef.current && completed && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="200px"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <Box width="100px" height="100px" position="relative" marginBottom="6px">
              {!animated && <Image position="absolute" left="0" top="0" width="100px" height="100px" src={CompletedIcon} />}
              <Image position="absolute" left="13px" top="13px" width="74px" height="74px" src={CompletedStaticIcon} />
            </Box>
            <Box>Transfer completed</Box>
          </Box>
        )}
        {!isCompletedRef.current && !isTransferingRef.current && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="160px"
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
          >
            Please confirm the detail below
          </Box>
        )}
        <Box
          width="100%"
          borderRadius="24px"
          background="white"
          padding="24px"
          marginTop="40px"
          display="flex"
          flexDirection="column"
          boxShadow="0px 4px 60px 0px rgba(44, 53, 131, 0.08)"
        >
          <Box paddingTop="13px" paddingBottom="27px" borderBottom="1px solid rgba(73, 126, 230, 0.2)">
            <Box fontSize="16px" color="#818181" marginBottom="16px">
              Transfer
            </Box>
            <Box fontSize="32px" lineHeight={'1'} fontWeight="700">
              {withdrawAmount} USDC
            </Box>
          </Box>
          <Box paddingTop="26px" paddingBottom="12px">
            <Box fontSize="16px" color="#818181" marginBottom="16px">
              To
            </Box>
            <Box fontSize="18px" fontWeight="700">
              {sendTo}
            </Box>
          </Box>
        </Box>

        <Box marginTop="40px" width="100%">
          {isTransferingRef.current && (
            <Button size="xl" type="black" width="100%" isDisabled>
              Transferring
            </Button>
          )}

          {!isTransferingRef.current && !isCompletedRef.current && (
            <Button size="xl" type="black" width="100%" onClick={onWithdraw}>
              Confirm
            </Button>
          )}

          {isCompletedRef.current && (
            <a onClick={() => closeModal()}>
              <Button size="xl" type="black" width="100%">
                Done
              </Button>
            </a>
          )}
        </Box>
      </Box>
    </Box>
  );
}
