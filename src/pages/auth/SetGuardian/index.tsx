import { useState } from 'react';
import { Box, Flex, useToast } from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import { SignHeader } from '@/pages/public/Sign';
import EditGuardianForm from './EditGuardianForm';
import { ZeroHash, ethers } from 'ethers';
import { SocialRecovery } from '@soulwallet/sdk';
import api from '@/lib/api';
import { useSettingStore } from '@/store/setting';
import { useGuardianStore } from '@/store/guardian';

export default function SetGuardian({ walletName, back, onCreate }: any) {
  const [isCreating, setIsCreating] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const { saveAddressName } = useSettingStore();
  const { setGuardiansInfo } = useGuardianStore();
  const toast = useToast();

  const onDone = async (guardianAddresses: any, guardianNames: any, threshold: any) => {
    console.log('onDone', guardianAddresses, guardianNames, threshold);

    try {
      setIsCreating(true)
      const guardianHash = SocialRecovery.calcGuardianHash(guardianAddresses, threshold);

      const guardiansInfo = {
        guardianHash: guardianHash,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold: Number(threshold),
          salt: ZeroHash,
        },
      };

      // todo, backup guardians
      await api.guardian.backupGuardians(guardiansInfo);

      for (let i = 0; i < guardianAddresses.length; i++) {
        const address = guardianAddresses[i];
        const name = guardianNames[i];
        if (address) saveAddressName(address.toLowerCase(), name);
      }

      setGuardiansInfo(guardiansInfo);

      await onCreate(guardianHash);
      setIsCreating(false)
    } catch (error: any) {
      const message = error.message
      toast({
        title: message,
        status: 'error',
      });
      setIsCreating(false)
    }
  };

  const onSkip = async() => {
    try {
      setIsSkipping(true)
      await onCreate(ethers.ZeroHash);
      setIsSkipping(false)
    } catch (error: any) {
      const message = error.message
      toast({
        title: message,
        status: 'error',
      });
      setIsSkipping(false)
    }
  };

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
        maxWidth="780px"
        margin="0 auto"
        marginTop="60px"
      >
        <RoundContainer
          width="1058px"
          minHeight="348px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
          position="relative"
        >
          <Box position="absolute" height="4px" width="75%" background="#FF2E79" top="0" left="0" />
          <Box
            width="100%"
            display="flex"
            justifyContent={{ base: 'center', md: 'flex-start' }}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box
              paddingLeft={{ base: '0px', md: '68px' }}
              paddingTop={{ base: '20px', md: '64px' }}
            >
              <Box
                width="40px"
                height="40px"
                color="white"
                background="black"
                borderRadius="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="20px"
                fontWeight="800"
                margin={{ base: '0 auto', md: '0' }}
              >
                3
              </Box>
            </Box>
            <Box
              width="100%"
              height="100%"
              paddingLeft={{ base: '20px', md: '26px' }}
              paddingTop={{ base: '20px', md: '60px' }}
              paddingBottom={{ base: '20px', md: '60px' }}
              paddingRight={{ base: '20px', md: '98px' }}
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading type="h3" fontSize={{ base: '20px', md: '26px' }} textAlign="left" width="100%" marginBottom="2px">
                {`Setup guardians for < ${walletName} >`}
              </Heading>
              <TextBody fontWeight="400" fontSize="16px">
                Get protected with social recovery once you lost the wallet
              </TextBody>
              <Box marginTop="35px" width="100%">
                <EditGuardianForm
                  onConfirm={onDone}
                  onSkip={onSkip}
                  onBack={back}
                  isCreating={isCreating}
                  isSkipping={isSkipping}
                  editType={'add'}
                />
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  );
}
