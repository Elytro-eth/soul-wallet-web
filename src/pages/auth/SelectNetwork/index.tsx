import { useState, useCallback } from 'react';
import useBrowser from '@/hooks/useBrowser';
import { Box, Flex, useToast, Input, Menu, MenuButton, MenuItem, MenuList, Image } from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
import { SignHeader } from '@/pages/public/Sign';
import IconEth from '@/assets/chains/eth.svg';
import IconChevron from '@/assets/icons/chevron-down-gray.svg';

export default function SetWalletName({ onNext, walletName, setWalletName }: any) {
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
          <Box position="absolute" height="4px" width="25%" background="#FF2E79" top="0" left="0" />
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
                1
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
                Select network
              </Heading>
              <TextBody fontWeight="400" fontSize="16px">
                Name your wallet and choose a network
              </TextBody>
              <Box
                background="white"
                height="100%"
                width="100%"
                roundedBottom="20px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginTop="40px"
              >
                <Box width="100%" maxWidth="548px" display="flex" gap="8px">
                  <Box>
                    <Menu>
                      <MenuButton>
                        <Box
                          height="52px"
                          border="1px solid rgb(226, 232, 240)"
                          borderRadius="12px"
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-start"
                          flexDirection="row"
                          width="192px"
                          padding="14px"
                        >
                          <Image src={IconEth} w="24px" h="24px" />
                          <Box marginLeft="4px">
                            <Box fontWeight="600" fontSize="16px">
                              Ethereum
                            </Box>
                          </Box>
                          <Image src={IconChevron} marginLeft="auto" />
                        </Box>
                      </MenuButton>
                      <MenuList w="260px"></MenuList>
                    </Menu>
                  </Box>
                  <Input
                    height="52px"
                    borderRadius="12px"
                    placeholder="Enter wallet name"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                  />
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="flex-end"
                justifyContent="center"
                flexDirection="column"
                width="100%"
                marginTop="24px"
              >
                <Box>
                  <Button
                    type="black"
                    color="white"
                    padding="0 20px"
                    disabled={!walletName}
                    onClick={() => onNext()}
                    size="lg"
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  );
}
