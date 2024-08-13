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
import { isAddress } from 'viem';

export default function AddWalletGuardian({isModal, callback, defaultGuardianAddress, defaultGuardianName}: any) {
  // const toast = useToast();
  // const navigate = useNavigate();
  // const [step, setStep] = useState(0);
  // const screenSize = useScreenSize()
  const navigate = useNavigate();
  const { innerHeight } = useScreenSize()
  const { doSetGuardians } = useRecover();
  const { guardianAddressName, saveGuardianAddressName } = useSettingStore();
  const [changingGuardian, setChangingGuardian] = useState(false);
  const { closeModal } = useWalletContext();
  const [isENSOpen, setIsENSOpen] = useState(false);
  const [isENSLoading, setIsENSLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [guardianAddress, setGuardianAddress] = useState<string>(defaultGuardianAddress || '');
  const [guardianName, setGuardianName] = useState(defaultGuardianName || '');
  const [addressStatus, setAddressStatus] = useState(0);

  const onAddressChange = (value: string) => {
    setGuardianAddress(value)
    setSearchText(String((value || '')).toLowerCase());

    if (extractENSAddress(value)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  }

  const activeENSNameRef = useRef();
  const menuRef = useRef();
  const inputRef = useRef<any>();

  const inputOnFocus = (value: any) => {
    setSearchText(String((value || '')).toLowerCase());

    if (extractENSAddress(value)) {
      setIsENSOpen(true);
    } else {
      setIsENSOpen(false);
    }
  };

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
      await doSetGuardians([guardianAddress], [guardianName], defaultThreshold);
      saveGuardianAddressName(guardianAddress, guardianName);
      closeModal();
      navigate('/dashboard')
    } finally {
      setChangingGuardian(false);
    }
  };


  const handleBlur = () => {
    const input = inputRef.current;
    if (input) {
      input.scrollLeft = input.scrollWidth;
    }
  };

  const onConfirm = async () => {
    if(callback){
      callback(guardianAddress, guardianName)
    }else{
      doChangeGuardian()
    }
  }

  const isValidAddress = guardianAddress && isAddress(guardianAddress);

  return (
    <Box
      width="100%"
      height={{
        sm: innerHeight,
        md: '100%',
      }}
      overflowY="auto"
    >
      <Box
        fontSize="16px"
        fontWeight="500"
        padding="10px 30px"
        display={{
          sm: 'flex',
          md: 'none'
        }}
      >

      </Box>
      <Box
        // height="calc(100% - 94px)"
        // overflowY="auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="100%">
          <Box padding="30px" paddingTop="40px">
            <Box fontSize="28px" fontWeight="500" color="#161F36">
              Add wallet address
            </Box>
            <Box fontWeight="400" fontSize="14px" lineHeight="14px" marginBottom="8px"  marginTop="24px" color="#95979C">
              ENS or wallet address
            </Box>
            <Box position="relative">
              <Input
                ref={setInputRef}
                spellCheck={false}
                value={guardianAddress}
                onChange={e => onAddressChange(e.target.value)}
                onBlur={() => {setAddressStatus(1); handleBlur();}}
                onFocus={(e: any) => inputOnFocus(e.target.value)}
                fontSize="20px"
                lineHeight="24px"
                fontWeight="400"
                placeholder="Enter or paste here"
                border="none"
                outline="none"
                _focusVisible={{ border: 'none', boxShadow: 'none' }}
                background="#F2F3F5"
                borderRadius="16px"
                padding="16px"
                height="56px"
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
            {!!addressStatus && !!guardianAddress && !isValidAddress &&
             <Box display="flex" bottom="-20px" position="absolute" alignItems="center" justifyContent="flex-start" marginTop="5px">
               <Box fontWeight="400" fontSize="14px" lineHeight="15px" color="#E8424C">
                 Invalid address
               </Box>
             </Box>
            }
            <Box fontWeight="400" fontSize="14px" lineHeight="14px" marginBottom="8px"  marginTop="24px" color="#95979C">
              Recovery contact name (optional)
            </Box>
            <Box>
              <Input
                spellCheck={false}
                fontSize="20px"
                lineHeight="24px"
                fontWeight="400"
                placeholder="Enter or paste here"
                border="none"
                value={guardianName}
                onChange={e=> setGuardianName(e.target.value)}
                outline="none"
                _focusVisible={{ border: 'none', boxShadow: 'none' }}
                background="#F2F3F5"
                borderRadius="16px"
                padding="16px"
                height="56px"
              />
            </Box>
            <Button size="xl" type="gradientBlue" width={{ sm: '100%', md: '200px' }} marginTop="60px" marginLeft={{ sm: '0', md: 'calc(100% - 200px)' }} disabled={!isValidAddress} loading={changingGuardian} onClick={onConfirm}>
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
