import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import Button from '@/components/mobile/Button';
import CopyIcon from '@/components/Icons/mobile/Copy';
import { useTempStore } from '@/store/temp';
import useTools from '@/hooks/useTools';
import EmailGuardianIcon from '@/assets/verify-email.svg'
import useScreenSize from '@/hooks/useScreenSize'

export default function RecoverVerifyEmail() {
  const { emailTemplate } = useTempStore();
  const { doCopy } = useTools();
  const { innerHeight } = useScreenSize()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      marginTop="60px"
      position="relative"
      height={innerHeight - 60}
      overflowY="auto"
    >
      <Box marginBottom="8px" height="96px" width="96px">
        <Image height="96px" width="96px" src={EmailGuardianIcon} />
      </Box>
      <Box
        fontSize="28px"
        fontWeight="500"
        lineHeight="24px"
        width="100%"
        padding="0 30px"
        color="#161F36"
        textAlign="center"
      >
        Verify Email
      </Box>
      <Box
        padding="24px"
        fontSize="14px"
        fontWeight="400"
        color="#676B75"
        textAlign="center"
      >
        Please send the following content via recovery email.
      </Box>
      <Box width="100%" padding="0 30px">
        <Box
          boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
          border="1px solid rgba(0, 0, 0, 0.05)"
          borderRadius="16px"
          overflow="hidden"
        >
          <Box
            padding="14px 24px"
            fontWeight="500"
            fontSize="18px"
            color="#161F36"
          >
            New Message
          </Box>
          <Box
            padding="8px"
            // marginBottom="24px"
          >
            <Box
              display="flex"
              alignItems="center"
              background="#F2F3F5"
              padding="14.5px 12px"
              borderRadius="12px"
            >
              <Box width="40px" marginRight="25px" fontSize="14px" fontWeight="500" color="#95979C">FROM</Box>
              <Box fontSize="18px" color="#161F36">{emailTemplate.from || '...'}</Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              background="#F2F3F5"
              padding="14.5px 12px"
              borderRadius="12px"
              marginTop="8px"
            >
              <Box width="40px" marginRight="25px" fontSize="14px" fontWeight="500" color="#95979C">TO</Box>
              <Box display="flex" alignItems="center" fontSize="18px" color="#161F36">
                <Box>{emailTemplate.to || '...'}</Box>
                <Box marginLeft="4px" onClick={()=> doCopy(emailTemplate.to)}><CopyIcon /></Box>
              </Box>
            </Box>
            <Box
              marginTop="8px"
              display="flex"
              alignItems="flex-start"
              background="#F2F3F5"
              padding="14.5px 12px"
              borderRadius="12px"
              flexDirection="column"
            >
              <Box marginRight="25px" fontSize="14px" fontWeight="500" color="#95979C" display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box>SUBJECT</Box>
                <Box onClick={()=> doCopy(emailTemplate.subject)}><CopyIcon /></Box>
              </Box>
              <Box marginTop="5px" display="flex" alignItems="center"  width="100%">
                <Box width="100%">{emailTemplate.subject}</Box>
              </Box>
            </Box>
            <Box
              marginTop="8px"
              display="flex"
              alignItems="flex-start"
              background="#F2F3F5"
              padding="14.5px 12px"
              borderRadius="12px"
              flexDirection="column"
            >
              <Box marginRight="25px" fontSize="14px" fontWeight="500" color="#95979C" display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box>CONTENT</Box>
              </Box>
              <Box marginTop="5px" display="flex" alignItems="center"  width="100%">
                <Box width="100%" color="#95979C">(Empty)</Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box height="120px" width="1px" />
      </Box>
      <Box
        position="fixed"
        padding="0 30px"
        width="100%"
        paddingTop="20px"
        paddingBottom="20px"
        // background="white"
        left="0"
        bottom="0"
      >
        <Link href={emailTemplate.mailToLink}>
          <Button size="xl" type="gradientBlue" width="100%">Send via default email app</Button>
        </Link>
      </Box>
    </Box>
  );
}
