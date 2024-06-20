import React, { useState, useCallback, useEffect, Fragment, useRef } from 'react';
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
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver';
import useForm from '@/hooks/useForm';
import { ZeroHash } from 'ethers';
import Button from '@/components/mobile/Button';
import useScreenSize from '@/hooks/useScreenSize'
import useRecover from '@/hooks/useRecover';
import { useSettingStore } from '@/store/setting';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function AddWalletGuardian({isModal}: any) {
  // const toast = useToast();
  // const navigate = useNavigate();
  // const [step, setStep] = useState(0);
  // const screenSize = useScreenSize()
  const navigate = useNavigate();
  const innerHeight = window.innerHeight - 134
  const { doSetGuardians } = useRecover();
  const { guardianAddressName, saveGuardianAddressName } = useSettingStore();
  const [changingGuardian, setChangingGuardian] = useState(false);
  const { closeModal } = useWalletContext();
  const [isENSOpen, setIsENSOpen] = useState(false);
  const [isENSLoading, setIsENSLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [guardianAddress, setGuardianAddress] = useState<string>('');
  const [guardianName, setGuardianName] = useState('');

  const onAddressChange = (val: string) => {
    setGuardianAddress(val)
    setSearchText(val);

    if (extractENSAddress(val)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  }

  const activeENSNameRef = useRef();
  const menuRef = useRef();
  const inputRef = useRef();

  // const inputOnFocus = (value: any) => {
  //   setSearchText(value);

  //   if (extractENSAddress(value)) {
  //     setIsENSOpen(true);
  //   } else {
  //     setIsENSOpen(false);
  //   }
  // };

  const setMenuRef = (value: any) => {
    menuRef.current = value;
  };

  const setInputRef = (value: any) => {
    inputRef.current = value;
  };

  const setActiveENSNameRef = (value: any) => {
    activeENSNameRef.current = value;
  };

  const getActiveENSNameRef = (value: any) => {
    return activeENSNameRef.current;
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        inputRef.current &&
        !(inputRef.current as any).contains(event.target) &&
        menuRef.current &&
        !(menuRef.current as any).contains(event.target)
      ) {
        setIsENSOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress);
    setGuardianAddress(resolvedAddress)
    // setErrors(({ receiverAddress, ...rest }: any) => rest);
    setIsENSOpen(false);
  };

  const doChangeGuardian = async () => {
    setChangingGuardian(true);
    try {
      const defaultThreshold = 1;
      await doSetGuardians([searchText], [guardianName], defaultThreshold);
      saveGuardianAddressName(searchText, guardianName);
      closeModal();
      navigate('/dashboard')
    } finally {
      setChangingGuardian(false);
    }
  };

  return (
    <Box width="100%" height="100%">
      <Box fontSize="16px" fontWeight="600" padding="10px 30px" paddingTop="60px">Add Wallet Guardian</Box>
      <Box height={innerHeight} padding="30px">
        <Box fontWeight="700" fontSize="24px" lineHeight="14px" marginBottom="20px"  marginTop="50px">
          ENS or wallet address
        </Box>
        <Box
          position="relative"
        >
          <Input
            ref={setInputRef}
            spellCheck={false}
            value={guardianAddress}
            onChange={e => onAddressChange(e.target.value)}
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
          <ENSResolver
            _styles={{
              width: '100%',
              top: '65px',
              left: '0',
              right: '0',
              borderRadius: '12px'
            }}
            isENSOpen={isENSOpen}
            setIsENSOpen={setIsENSOpen}
            isENSLoading={isENSLoading}
            setIsENSLoading={setIsENSLoading}
            searchText={searchText}
            setSearchText={setSearchText}
            searchAddress={searchAddress}
            setSearchAddress={setSearchAddress}
            resolvedAddress={resolvedAddress}
            setResolvedAddress={setResolvedAddress}
            setMenuRef={setMenuRef}
            submitENSName={submitENSName}
            setActiveENSNameRef={setActiveENSNameRef}
            getActiveENSNameRef={getActiveENSNameRef}
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
            value={guardianName}
            onChange={e=> setGuardianName(e.target.value)}
            outline="none"
            _focusVisible={{ border: 'none', boxShadow: 'none' }}
          />
        </Box>
        <Button size="xl" type="blue" width="100%" marginTop="60px" loading={changingGuardian} onClick={doChangeGuardian}>
          Add
        </Button>
      </Box>
    </Box>
  );
}
