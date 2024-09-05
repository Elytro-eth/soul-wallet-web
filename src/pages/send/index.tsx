import { useState, useCallback, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import SetAddress from './SetAddress';
import SetAmount from './SetAmount';
import Review, { TransactionType } from '@/components/Review';
import useScreenSize from '@/hooks/useScreenSize'
import useWallet from '@/hooks/useWallet';
import { ZeroAddress } from 'ethers/constants';
import { Address, formatEther, TransactionRequestBase } from 'viem';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function Send({ isModal }: any) {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState<number>();
  const [sendTo, setSendTo] = useState<Address>('' as Address);
  const [tokenAddress, setTokenAddress] = useState<Address>('' as Address);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const { innerHeight } = useScreenSize()
  const { getTransferEthOpTxs, getTransferErc20OpTxs } = useWallet();
  const [tx, setTx] = useState<TransactionRequestBase | null | undefined>(null)
  const { closeFullScreenModal } = useWalletContext();

  const onPrev = useCallback(() => {
    console.log('prev', step);
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  }, [step]);

  const onNext = useCallback(() => {
    console.log('next');
    setStep(step + 1);
    if (step === 1) {
      genTxs()
    }
  }, [step, amount]);

  const genTxs = useCallback(() => {
    if (selectedToken && amount) {
      if (tokenAddress === ZeroAddress) {
        const ts = getTransferEthOpTxs(
          String(amount),
          sendTo
        );
        setTx(ts);
      } else {
        const ts = getTransferErc20OpTxs(
          String(amount),
          selectedToken.decimals,
          sendTo,
          tokenAddress
        );
        setTx(ts);
      }
    }
  }, [amount])
  return (
    <Box
      width="100%"
      height={innerHeight}
      display="flex"
      padding={{
        base: '0',
        lg: '72px'
      }}
    >
      <Box
        width="380px"
        display={{
          base: 'none',
          lg: 'flex'
        }}
        flexDirection="column"
        marginTop="64px"
      >
        <Box
          fontSize="14px"
          lineHeight="17.5px"
          marginBottom="18px"
          paddingLeft="12px"
          fontWeight={step === 0 ? '500' : '400'}
          color={step === 0 ? '#161F36' : '#676B75'}
          borderLeft={step === 0 ? '2px solid #161F36' : '2px solid transparent'}
        >
          Recipient
        </Box>
        <Box
          fontSize="14px"
          lineHeight="17.5px"
          marginBottom="18px"
          paddingLeft="12px"
          fontWeight={step === 1 ? '500' : '400'}
          color={step === 1 ? '#161F36' : '#676B75'}
          borderLeft={step === 1 ? '2px solid #161F36' : '2px solid transparent'}
        >
          Amount
        </Box>
        <Box
          fontSize="14px"
          lineHeight="17.5px"
          marginBottom="18px"
          paddingLeft="12px"
          fontWeight={step === 2 ? '500' : '400'}
          color={step === 2 ? '#161F36' : '#676B75'}
          borderLeft={step === 2 ? '2px solid #161F36' : '2px solid transparent'}
        >
          Review
        </Box>
      </Box>
      <Box
        width={{
          base: '100%',
          lg: '480px'
        }}
      >
        <Box width="100%">
          {step === 0 && <SetAddress isModal onNext={onNext} sendTo={sendTo} setSendTo={setSendTo} />}
          {step === 1 && <SetAmount isModal amount={amount} setAmount={setAmount} onPrev={onPrev} onNext={onNext} tokenAddress={tokenAddress} setTokenAddress={setTokenAddress} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />}
          {step === 2 && <Review
            isModal
            tx={tx}
            transactionType={TransactionType.transfer}
            selectedToken={selectedToken}
            sendTo={sendTo}
            onPrev={onPrev}
            onClose={() => closeFullScreenModal()}
          />}
        </Box>
      </Box>
    </Box>
  )
}
