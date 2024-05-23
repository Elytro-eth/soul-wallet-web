import React, { useState, useCallback } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Image,
  Flex,
  useToast,
  Input
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import { useSignerStore } from '@/store/signer';
import { ethers } from 'ethers';
import { useTempStore } from '@/store/temp';
import NoWalletIcon from '@/assets/icons/no-wallet.svg'
import { SignHeader } from '@/pages/public/Sign';
import { trimPrefix } from '@/lib/tools'

export default function ImportAccount({ importWallet, isImporting, back }: any) {
  const [address, setAddress] = useState('')
  const {
    credentials,
  } = useSignerStore();
  const { navigate } = useBrowser();

  const skip = useCallback(() => {
    console.log('skip')
    navigate(`/dashboard`);
  }, [])

  const onAddressChange = useCallback((e: any) => {
    const address = e.target.value
    console.log('address', address)
    setAddress(address)
  }, [])

  const next = useCallback(() => {
    navigate(`/dashboard`);
  }, [credentials])

  const goToCreate = useCallback(() => {
    back()
  }, [])

  const goToRecover = useCallback(() => {
    navigate(`/recover`);
  }, [])

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="calc(100% - 58px)"
        flexDirection="column"
        width="100%"
        paddingTop="60px"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '84px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box height="100px" width="100px" borderRadius="100px" marginBottom="30px">
              <Image width="100px" height="100px" borderRadius="100px" src={NoWalletIcon} />
            </Box>
            <Heading marginBottom="0" type="h3">
              No wallet found on this device
            </Heading>
            <TextBody fontWeight="600">To access your Soul wallet, please enter Soul wallet address</TextBody>
            <Box
              background="white"
              height="100%"
              width="100%"
              roundedBottom="20px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              padding={{ base: '30px 0', md: '30px' }}
            >
              <Box width="100%" maxWidth="548px" display="flex" marginBottom="10px" flexDirection="column">
                <Input height="44px" borderRadius="12px" placeholder="Enter wallet address" value={address} onChange={onAddressChange} />
                <Box fontSize="14px" fontWeight="400" display="flex" alignItems="center" marginTop="10px" padding="0 10px">
                  Forgot address? Try <Box fontSize="14px" color="#FF2E79" fontWeight="700" marginLeft="6px" cursor="pointer" onClick={goToRecover}>Social Recovery</Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%">
              <Box>
                <Button
                  type="white"
                  padding="0 20px"
                  marginRight="16px"
                  onClick={back}
                  size="xl"
                >
                  Back
                </Button>
                <Button
                  type="black"
                  color="white"
                  padding="0 20px"
                  disabled={!ethers.isAddress(trimPrefix(address)) || isImporting}
                  onClick={() => importWallet(trimPrefix(address))}
                  loading={isImporting}
                  size="xl"
                >
                  Go to my wallet
                </Button>
              </Box>
              <Box fontWeight="400" fontSize="14px" textAlign="center" marginTop="20px">
                For new users, please <Box as="span" fontWeight="700" fontSize="14px" marginLeft="2px" onClick={goToCreate} cursor="pointer">Create New Account</Box>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  )
}
