import { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Flex,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import PlusIcon from '@/components/Icons/Plus';
import ComputerIcon from '@/components/Icons/Computer';
import usePassKey from '@/hooks/usePasskey';
import { SignHeader } from '@/pages/public/Sign';

export default function SetPasskey({ back, walletName, next: nextStep,  }: any) {
  const [credentials, setCredentials] = useState<any>([])
  const { register } = usePassKey()
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createCredential = async () => {
    try {
      setIsCreating(true);
      const credentialKey = await register(walletName);
      setCredentials([...credentials, credentialKey])
      setIsCreating(false);
    } catch (error: any) {
      console.log('ERR', error)
      console.log('error', error);
      let message = error.message

      if (message && message.indexOf('The operation either timed out or was not allowed') !== -1) {
        message = 'Useer canceled the operation.'
      }

      setIsCreating(false);
      toast({
        title: message,
        status: 'error',
      });
    }
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
            width="50%"
            background="#FF2E79"
            top="0"
            left="0"
          />
          <Box
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
                2
              </Box>
            </Box>
          </Box>
          <Box
            width="calc(100% - 108px)"
            height="100%"
            paddingLeft="26px"
            paddingTop="60px"
            paddingBottom="34px"
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
              {`Set up passkey for < ${walletName} >`}
            </Heading>
            <TextBody
              fontWeight="400"
              fontSize="16px"
            >
              Passkey will be used to sign every transaction in your wallet
            </TextBody>
            {(!!credentials && !!credentials.length) && (
              <Box
                borderRadius="12px"
                width="700px"
                maxWidth="100%"
                marginTop="40px"
              >
                <Flex display="flex" alignItems="flex-start" justifyContent="center" flexDirection="column" width="100%" gap="2">
                  {credentials.map((passKey: any, index: number) =>
                    <Box
                      key={index}
                      background="white"
                      borderRadius="16px"
                      padding="12px"
                      width="100%"
                      marginBottom="4px"
                      border="1px solid #F0F0F0"
                    >
                      <Box display="flex" alignItems="center">
                        <Box width="50px" height="50px" background="#efefef" borderRadius="50px" marginRight="16px" display="flex" alignItems="center" justifyContent="center"><ComputerIcon /></Box>
                        <Box>
                          <Text color="rgb(7, 32, 39)" fontSize="18px" fontWeight="800">
                            {passKey.name}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Flex>
              </Box>
            )}
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              marginTop="18px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Button
                maxWidth="100%"
                width="100%"
                padding="0 20px"
                type="white"
                disabled={isCreating}
                loading={isCreating}
                onClick={createCredential}
                size="lg"
                height="48px"
                borderWidth="0"
                background="#F9F9F9"
                borderRadius="12px"
              >
                <Box marginRight="8px"><PlusIcon color="black" /></Box>
                {!credentials.length ? `Add a Passkey` : 'Add another Passkey'}
              </Button>
            </Box>
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="space-between"
              width="100%"
              marginTop="24px"
            >
              <Box>
                <Button
                  type="white"
                  padding="0 20px"
                  onClick={back}
                  size="lg"
                >
                  Back
                </Button>
              </Box>
              <Box>
                <Button
                  type="black"
                  color="white"
                  padding="0 20px"
                  onClick={nextStep}
                  size="lg"
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  )
}
