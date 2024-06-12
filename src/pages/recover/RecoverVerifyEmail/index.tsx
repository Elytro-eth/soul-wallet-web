import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import Button from '@/components/mobile/Button';
import CopyIcon from '@/components/Icons/mobile/Copy';

export default function RecoverVerifyEmail({ isModal }: any) {

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      marginTop="24px"
      position="relative"
      height={window.innerHeight - 80}
    >
      <Box
        fontSize="24px"
        fontWeight="600"
        lineHeight="24px"
        width="100%"
        marginTop="60px"
        padding="0 30px"
      >
        Verify Email
      </Box>
      <Box padding="24px 30px" fontSize="14px" fontWeight="400">
        Please go to your email and send the following content. This email will be used for approve your recovery request on chain.
      </Box>
      <Box width="100%" padding="0 30px">
        <Box
          boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.05)"
          border="1px solid rgba(0, 0, 0, 0.05)"
          borderRadius="8px"
          overflow="hidden"
        >
          <Box
            padding="14px 24px"
            fontWeight="600"
            fontSize="16px"
            background="#F2F2F2"
          >
            New Message
          </Box>
          <Box
            padding="0 24px"
            marginBottom="24px"
          >
            <Box display="flex" alignItems="center" marginTop="24px">
              <Box width="40px" marginRight="25px">From</Box>
              <Box>{`******@gmail.com`}</Box>
            </Box>
            <Box display="flex" alignItems="center" marginTop="24px">
              <Box width="40px" marginRight="25px">To</Box>
              <Box display="flex" alignItems="center">
                <Box>{`security@soulwallet.io`}</Box>
                <Box marginLeft="4px"><CopyIcon /></Box>
              </Box>
            </Box>
            <Box marginTop="50px">
              <Box color="rgba(0, 0, 0, 0.5)">Subject</Box>
              <Box marginTop="20px" display="flex" alignItems="center">
                <Box width="calc(100% - 40px)">{`Please recover my wallet (0x8d34947d8cba2abd7e8d5b788c8a3674325c93d1, 0x8d34947d8cba2abd7e8d5b788c8a3674325c93d1)`}</Box>
                <Box marginLeft="auto"><CopyIcon /></Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box padding="0 30px" width="100%" marginTop="40px">
        <Button size="xl" type="blue" width="100%">Send via default email app</Button>
      </Box>
    </Box>
  );
}
