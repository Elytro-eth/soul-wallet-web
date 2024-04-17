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
                <EditGuardianForm onConfirm={(v:any) => {console.log(v)}} canGoBack={false} canConfirm={false} editType={'add'} />
              </Box>
              <Box
                background="white"
                height="100%"
                width="100%"
                roundedBottom="20px"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                marginTop="16px"
                borderTop="1px solid rgba(0, 0, 0, 0.1)"
                paddingTop="24px"
              >
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  marginTop="10px"
                  alignItems="flex-start"
                  flexDirection="column"
                >
                  <Box
                    fontFamily="Nunito"
                    fontWeight="700"
                    fontSize="14px"
                    marginRight="6px"
                  >
                    Threshold
                  </Box>
                  <Box marginTop="2px">
                    <TextBody
                      type="t2"
                      justifyContent="flex-start"
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Box>Recovery wallet requires number of guardian(s) confirmation.</Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        marginTop="14px"
                      >
                        <Box
                          width="80px"
                          marginRight="10px"
                        >
                          <Box
                            px={2}
                            py={2}
                            width="80px"
                            transition="all 0.2s"
                            borderRadius="16px"
                            borderWidth="1px"
                            padding="12px"
                            background="white"
                            _expanded={{
                              borderColor: '#3182ce',
                              boxShadow: '0 0 0 1px #3182ce',
                            }}
                          >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              {0}
                              <DropDownIcon />
                            </Box>
                          </Box>
                        </Box>
                        <Box>{`out of ${3} guardian(s) confirmation.`}</Box>
                      </Box>
                    </TextBody>
                  </Box>
                </Box>
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
                    onClick={onCreate}
                    size="lg"
                  >
                    Done
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  )
}
