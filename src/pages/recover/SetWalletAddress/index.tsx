import { useState } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Flex,
  useToast
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import { useTempStore } from '@/store/temp';
import useForm from '@/hooks/useForm';
import FormInput from '@/components/new/FormInput'
import { ethers } from 'ethers';
import api from '@/lib/api';
import StepProgress from '../StepProgress'
import { SignHeader } from '@/pages/public/Sign';
import WalletCheckedIcon from '@/components/Icons/WalletChecked'

const validate = (values: any) => {
  const errors: any = {};
  const { address } = values;

  let trimedAddress = address ? address.trim() : '';
  if (trimedAddress.includes(':')) {
    trimedAddress = trimedAddress.split(':')[1];
  }

  if (!ethers.isAddress(trimedAddress)) {
    errors.address = 'Invalid Address';
  }

  return errors;
};

export default function SetWalletAddress({ next, back }: any) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { updateRecoverInfo } = useTempStore()

  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['address'],
    validate,
  });
  const disabled = loading || invalid;

  const handleNext = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      let walletAddress = values.address;
      if(walletAddress.includes(':')) {
        walletAddress = walletAddress.split(':')[1]
      }
      const res1 = await api.account.list({ address: walletAddress });
      if (!res1.data) {
        setLoading(false);
        toast({
          title: 'No wallet found!',
          status: 'error',
        });
        return
      }

      const info = res1.data[0]
    //   {
    //     "address": "0xfd2a27261850d891d1785df5c9f68e3f8ea19b2b",
    //     "chainID": "0xaa37dc",
    //     "name": "mini1",
    //     "createAt": "2024-04-18T02:23:09.558Z",
    //     "initInfo": {
    //         "index": 0,
    //         "initialKeys": [
    //             "0x112293ace9b09d253449bb0041615e2df8cfad28575b2ca7329888a249700b85"
    //         ],
    //         "initialGuardianHash": "0x99906d01f2675f126415f03e75adc7995e62da2279edffb5ddd67dab0dbf763a",
    //         "initialGuardianSafePeriod": "0x01"
    //     }
    // }

      // const initialKeysAddress = initialKeys

      // if (activeGuardianInfo.pendingGuardianHash !== activeGuardianInfo.activeGuardianHash && activeGuardianInfo.guardianActivateAt && activeGuardianInfo.guardianActivateAt * 1000 < Date.now()) {
      //   activeGuardianHash = activeGuardianInfo.pendingGuardianHash
      // } else {
      //   activeGuardianHash = activeGuardianInfo.activeGuardianHash
      // }

      const res2 = await api.guardian.getGuardianDetails({ guardianHash: info.initInfo.initialGuardianHash });
      const data = res2.data;

      if (!data) {
        toast({
          title: 'No guardians found!',
          status: 'error',
        })
        throw new Error('No guardians found!')
      }

      updateRecoverInfo({
        ...info,
        ...data,
      })

      setLoading(false);
      next()
    } catch (e: any) {
      setLoading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  };

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
              Step 1/4: Wallet address
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="550px"
              marginBottom="20px"
            >
              Enter any one of your wallet address on any chains, we'll be able to recover them all.
            </TextBody>
            <Box width="550px" maxWidth="100%">
              <FormInput
                label=""
                placeholder="Enter ENS or wallet adderss"
                value={values.address}
                onChange={onChange('address')}
                onBlur={onBlur('address')}
                errorMsg={showErrors.address && errors.address}
                _styles={{  w: '100%'  }}
                autoFocus={true}
                onEnter={handleNext}
              />
            </Box>
            <Box
              fontWeight="600"
              fontSize="14px"
              color="#0CB700"
              marginTop="6px"
              display="flex"
              alignItems="center"
            >
              <WalletCheckedIcon />
              <Box marginLeft="6px">Wallet found on Ethereum network</Box>
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="100px">
              <Button
                width="80px"
                type="white"
                marginRight="12px"
                size="lg"
                onClick={back}
              >
                Back
              </Button>
              <Button
                minWidth="80px"
                type="black"
                size="lg"
                onClick={handleNext}
                disabled={disabled}
                loading={loading}
              >
                Next
              </Button>
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={0} />
      </Box>
    </Flex>
  )
}
