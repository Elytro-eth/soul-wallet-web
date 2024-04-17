import { useState, useCallback } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Flex,
  useToast,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import { SignHeader } from '@/pages/public/Sign';
import DropDownIcon from '@/components/Icons/DropDown';
import EditGuardianForm from './EditGuardianForm'

export default function SetGuardian({walletName, back, onCreate }: any) {
  const onDone = (guardianAddresses: any, guardianNames: any, threshold: any) => {
    console.log('onDone', guardianAddresses, guardianNames, threshold)
    // onCreate();
  }

  const onSkip = () => {
    console.log('onSkip')
  }

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
          <Box
            position="absolute"
            height="4px"
            width="75%"
            background="#FF2E79"
            top="0"
            left="0"
          />
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-start"
          >
            <Box
              paddingLeft="68px"
              paddingTop="64px"
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
              <Heading
                type="h3"
                fontSize="26px"
                textAlign="left"
                width="100%"
                marginBottom="2px"
              >
                {`Setup guardians for < ${walletName} >`}
              </Heading>
              <TextBody
                fontWeight="400"
                fontSize="16px"
              >
                Get protected with social recovery once you lost the wallet
              </TextBody>
              <Box marginTop="35px" width="100%">
                <EditGuardianForm
                  onConfirm={onDone}
                  onBack={back}
                  onSkip={onSkip}
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
  )
}
