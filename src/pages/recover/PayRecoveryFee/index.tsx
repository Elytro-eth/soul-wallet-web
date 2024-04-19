import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Image,
  Flex,
  useToast
} from '@chakra-ui/react';
import { SignHeader } from '@/pages/public/Sign';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import { useTempStore } from '@/store/temp';
import useTools from '@/hooks/useTools';
import { ethers } from 'ethers';
import BN from 'bignumber.js';
import { useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { paymentContractConfig } from '@/contracts/contracts';
import { metaMask } from 'wagmi/connectors'
import useWalletContext from '@/context/hooks/useWalletContext';
import useWagmi from '@/hooks/useWagmi'
import RecoverCheckedIcon from '@/components/Icons/RecoverChecked'
import StepProgress from '../StepProgress'
import ConnectWalletModal from '../ConnectWalletModal'

export default function PayRecoveryFee({ next }: any) {
  const { showConnectWallet } = useWalletContext();
  const { recoverInfo } = useTempStore()
  const { recoveryID, recoveryRecord  } = recoverInfo
  const { estimatedFee } = recoveryRecord
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const [paying, setPaying] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const [isRecovered, setIsRecovered] = useState(false)
  const { doCopy } = useTools();
  const toast = useToast();
  const { switchChain } = useSwitchChain();
  const {
    connectEOA,
    isConnected,
    isConnectOpen,
    openConnect,
    closeConnect,
    isConnecting,
    chainId : connectedChainId
  } = useWagmi()
  const { writeContract: pay } = useWriteContract();

  const mainnetChainId = Number(import.meta.env.VITE_MAINNET_CHAIN_ID);

  const payUrl = `${location.origin}/public/pay/${recoveryID}`

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  const doPay = useCallback(async () => {
    try {
      setPaying(true)
      pay(
        {
          ...paymentContractConfig,
          functionName: 'pay',
          args: [recoveryID],
          value: ethers.parseEther(ethers.formatEther(BN(estimatedFee).toFixed())),
        },
        {
          onSuccess: (hash) => {
            setPaying(false)
            setIsPaid(true)
            toast({
              title: 'Pay request sent!',
              status: 'success',
            });
            console.log('success', hash);
          },
          onSettled: () => {
            console.log('settled');
          },
          onError: (error) => {
            setPaying(false)
            let message = error.message

            if (message && message.indexOf('does not have enough funds') !== -1) {
              message = 'Not enough balance in the wallet you connected'
            }

            if (message && message.indexOf('User rejected the request') !== -1) {
              message = 'User rejected the request.'
            }

            toast({
              title: message,
              status: 'error',
            });
            console.log('error', error);
          },
        },
      );
    } catch (error: any) {
      console.log('error', error.message)
    }
  }, [recoveryID, estimatedFee])

  useEffect(() => {
    generateQR(payUrl);
  }, []);

  console.log('estimatedFee', estimatedFee)
  console.log('isConnected222', isConnected)

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
          flexDirection={{ base: 'column', 'md': 'row' }}
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
              <Button
                size="lg"
                fontSize="18px"
                width="260px"
              >
                Go to Wallet
              </Button>
            </Box>
          </RoundContainer>
          <StepProgress activeIndex={3} />
          <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} />
        </Box>
      </Flex>
    )
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
        flexDirection={{ base: 'column', 'md': 'row' }}
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
            <Button
              size="lg"
              fontSize="18px"
              width="260px"
              disabled={isRecovering}
            >
              {isRecovering ? 'Recovering' : 'Confirm recovery'}
            </Button>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={3} />
        <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} />
      </Box>
    </Flex>
  )
}
