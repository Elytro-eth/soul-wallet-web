import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, Input, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import api from '@/lib/api';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import useTransaction from '@/hooks/useTransaction';
import { SocialRecovery } from '@soulwallet/sdk';
import useWallet from '@/hooks/useWallet';
import { validEmailDomains, validEmailProviders } from '@/config/constants';
import useForm from '@/hooks/useForm';
import { ZeroHash } from 'ethers';
import Button from '@/components/mobile/Button';
import useScreenSize from '@/hooks/useScreenSize'

export default function AddWalletGuardian() {
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const screenSize = useScreenSize()
  const innerHeight = window.innerHeight - 134

  return (
    <Box width="100%" height="100%">
      <Box fontSize="16px" fontWeight="600" padding="10px 30px" paddingTop="60px">Add Wallet Guardian</Box>
      <Box height={innerHeight} padding="30px">
        <Box fontWeight="700" fontSize="24px" lineHeight="14px" marginBottom="20px"  marginTop="50px">
          Set up username
        </Box>
        <Box>
          <Input
            spellCheck={false}
            fontSize="32px"
            lineHeight="24px"
            padding="0"
            fontWeight="700"
            placeholder="Enter or paste here"
            borderRadius="0"
            border="none"
            outline="none"
            _focusVisible={{ border: 'none', boxShadow: 'none' }}
          />
        </Box>
        <Box fontWeight="700" fontSize="16px" lineHeight="14px" marginBottom="20px" marginTop="40px">
          Guardian name (optional)
        </Box>
        <Box>
          <Input
            spellCheck={false}
            fontSize="18px"
            lineHeight="24px"
            padding="0"
            fontWeight="700"
            placeholder="Enter or paste here"
            borderRadius="0"
            border="none"
            outline="none"
            _focusVisible={{ border: 'none', boxShadow: 'none' }}
          />
        </Box>
        <Button size="xl" type="blue" width="100%" marginTop="60px">
          Add
        </Button>
      </Box>
    </Box>
  );
}
