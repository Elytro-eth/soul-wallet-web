import React, { useState } from 'react'
import { Box } from '@chakra-ui/react';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import Circle from '@/components/Icons/mobile/Circle';

export default function RecoverProcess({ step }: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box
      position="fixed"
      bottom="24px"
      left="16px"
      width="calc(100vw - 32px)"
      padding="24px"
      borderRadius="20px"
      background="white"
      boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.1)"
      zIndex="1"
    >
      <Box onClick={() => setIsOpen(!isOpen)} display="flex" alignItems="center" justifyContent="space-between">
        <Box fontSize="16px" fontWeight="700">Recovery process ({step}/3)</Box>
        <Box transform={isOpen ? '' : 'rotate(180deg)'}><ChevronDown /></Box>
      </Box>
      {isOpen && (
        <Box display="flex" gap="8px" flexDirection="column" marginTop="14px">
          <Box display="flex" alignItems="center">
            <Box marginRight="8px"><Circle active={step >= 1 ? true : false} /></Box>
            <Box fontSize="14px" fontWeight={step >= 1 ? '600' : '400'}>Step 1: Enter username</Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Box marginRight="8px"><Circle active={step >= 2 ? true : false} /></Box>
            <Box fontSize="14px" fontWeight={step >= 2 ? '600' : '400'}>Step 2: Add passkey</Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Box marginRight="8px"><Circle active={step >= 3 ? true : false} /></Box>
            <Box fontSize="14px" fontWeight={step >= 3 ? '600' : '400'}>Step 3: Guardian signature request</Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
