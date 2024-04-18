import { Box, Flex } from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import { SignHeader } from '@/pages/public/Sign';
import EditGuardianForm from './EditGuardianForm';
import { ZeroHash, ethers } from 'ethers';
import { SocialRecovery } from '@soulwallet/sdk';
import api from '@/lib/api';

export default function SetGuardian({ walletName, back, onCreate }: any) {
  const onDone = async (guardianAddresses: any, guardianNames: any, threshold: any) => {
    console.log('onDone', guardianAddresses, guardianNames, threshold);
    const guardianHash = SocialRecovery.calcGuardianHash(guardianAddresses, threshold);

    // todo, backup guardians
    await api.guardian.backupGuardians({
      guardianHash,
      guardianDetails: {
        guardians: guardianAddresses,
        threshold,
        salt: ZeroHash,
      },
    });
    await onCreate(guardianHash);
  };

  const onSkip = async() => {
    await onCreate(ethers.ZeroHash);
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
          <Box width="100%" display="flex" justifyContent="flex-start">
            <Box paddingLeft="68px" paddingTop="64px">
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
              >
                3
              </Box>
            </Box>
            <Box
              width="100%"
              height="100%"
              paddingLeft="26px"
              paddingTop="60px"
              paddingBottom="60px"
              paddingRight="98px"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading type="h3" fontSize="26px" textAlign="left" width="100%" marginBottom="2px">
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
                  canGoBack={false}
                  canConfirm={false}
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
