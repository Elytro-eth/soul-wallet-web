import { useState, useCallback } from 'react';
import {
  Box,
  Text,
  Flex,
  useToast,
  Input,
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import Button from '@/components/Button'
import ComputerIcon from '@/components/Icons/Computer';
import usePassKey from '@/hooks/usePasskey';
import { useTempStore } from '@/store/temp';
import api from '@/lib/api';
import StepProgress from '../StepProgress'
import { SignHeader } from '@/pages/public/Sign';
import { SocialRecovery } from '@soulwallet/sdk';
import DeleteIcon from '@/components/Icons/Delete'
import { RecoveryContainer } from '@/pages/recover'
import useConfig from '@/hooks/useConfig';

export default function AddSigner({ next, back }: any) {
  const [signers, setSigners] = useState<any>([])
  const [isConfirming, setIsConfirming] = useState<any>(false)
  const toast = useToast();
  const { register } = usePassKey()
  const { updateRecoverInfo } = useTempStore()
  const { recoverInfo } = useTempStore()
  const { selectedChainItem } = useConfig();
  const [newWalletName, setNewWalletName] = useState<any>(recoverInfo.name)

  const addCredential = async () => {
    try {
      const credential = await register(newWalletName, selectedChainItem.chainName);
      setSigners([...signers, { type: 'passkey', signerId: credential.publicKey, ...credential }])
    } catch (error: any) {
      let message = error.message

      if (message && message.indexOf('The operation either timed out or was not allowed') !== -1) {
        message = 'Useer canceled the operation.'
      }

      toast({
        title: message,
        status: 'error',
      });
    }
  }


  const handleNext = async () => {
    updateRecoverInfo({
      signers
    })

    try {
      setIsConfirming(true)
      const initialKeys = signers.map((signer: any) => signer.signerId)
      const newOwners = SocialRecovery.initialKeysToAddress(initialKeys)

      const params = {
        chainID: recoverInfo.chainID,
        address: recoverInfo.address,
        newOwners
      }

      const res1 = await api.guardian.createRecoverRecord(params)
      const recoveryID = res1.data.recoveryID
      const res2 = await api.guardian.getRecoverRecord({ recoveryID })
      const recoveryRecord = res2.data

      updateRecoverInfo({
        recoveryID,
        recoveryRecord,
        // enabled: false,
      });

      setIsConfirming(false)
      next()
    } catch (error: any) {
      setIsConfirming(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  };

  const removeSigner = useCallback((id: any) => {
    setSigners(signers.filter((item: any) => item.signerId !== id))
  }, [signers])

  console.log('signers', signers)

  return (
    <RecoveryContainer>
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
        width="100%"
        paddingTop="60px"
        flexDirection={{ base: 'column', 'md': 'row' }}
        marginTop="33px"
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
            <Heading marginBottom="18px" type="h4" fontSize={{ base: '20px', md: '24px' }} fontWeight="700">
              Step 2/4: Wallet setup
            </Heading>
            <Box fontSize="14px" fontWeight="400">
              Name your wallet
            </Box>
            <Box marginTop="14px" width="100%" maxWidth="548px">
              <Input type="text" placeholder="Enter wallet name" width="100%" value={newWalletName} onChange={e => setNewWalletName(e.target.value)} />
            </Box>
            <Box width="100%" marginTop="14px">
              {signers.map((signer: any) => {
                return (
                  <Box
                    background="white"
                    borderRadius="12px"
                    padding={{base: "12px", lg: "16px"}}
                    border="1px solid #E4E4E4"
                    marginBottom="14px"
                    key={signer.signerId}
                    position="relative"
                    maxWidth={{ base: '550px', md: '550px' }}
                    width={{ base: 'calc(100%)', md: '100%' }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                    >
                      <Box width={{ base: "40px", lg: "50px"}} flex={{ base: "0 0 40px", lg: "0 0 50px"}} height={{base: "40px", lg: "50px"}} background="#efefef" borderRadius="50px" marginRight={{base: "12px", lg: "16px"}} display="flex" alignItems="center" justifyContent="center"><ComputerIcon /></Box>
                      <Box>
                        <Text pr={{base: "18px", lg: 0}} color="rgb(7, 32, 39)" fontSize={{base: "14px", lg: "18px"}} fontWeight="800" wordBreak={"break-all"}>
                          {signer.name}
                        </Text>
                      </Box>
                    </Box>
                    <Box
                      onClick={() => removeSigner(signer.signerId)}
                      position="absolute"
                      width="40px"
                      right="0px"
                      top="0"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                    >
                      <DeleteIcon />
                    </Box>
                  </Box>
                )
              })}
            </Box>
            <Box
              width={{ base: '100%', md: '246px' }}
            >
              <Button
                size="lg"
                width={{ base: '100%', md: '246px' }}
                onClick={() => addCredential()}
              >
                {(signers && signers.length) ? `+ Add another passkey` : `+ Add passkey`}
              </Button>
            </Box>
            <Box color="rgba(0, 0, 0, 0.6)" fontSize="12px" marginTop="8px">
              *Passkey will be used to sign every transaction in your wallet.
            </Box>

            <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="43px">
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
                width="80px"
                maxWidth="100%"
                type="black"
                size="lg"
                onClick={handleNext}
                disabled={isConfirming || !signers || !signers.length}
                loading={isConfirming}
              >
                Next
              </Button>
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={1} />
      </Box>
    </RecoveryContainer>
  )
}
