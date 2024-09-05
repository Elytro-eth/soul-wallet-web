import React, { useState } from 'react'
import { Box } from '@chakra-ui/react';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import Circle from '@/components/Icons/mobile/Circle';

export default function RecoverProcess({ step }: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box
      position={{
        base: "fixed",
        lg: "static",
      }}
      bottom="20px"
      left="16px"
      width={{
        base: "calc(100vw - 32px)",
        lg: "345px",
      }}
      padding="24px"
      borderRadius="20px"
      background="white"
      boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.1)"
      border="1px solid #F2F3F5"
      zIndex="1"
      marginLeft={{
        base: '0',
        lg: '33px'
      }}
    >
      <Box onClick={() => setIsOpen(!isOpen)} display="flex" alignItems="center" justifyContent="space-between" cursor="pointer">
        <Box fontSize="18px" fontWeight="500" color="#161F36">Recovery process ({step + 1}/3)</Box>
        <Box
          transform={isOpen ? '' : 'rotate(180deg)'}
          display={{
            base: 'flex',
            lg: 'none'
          }}
        >
          <ChevronDown />
        </Box>
      </Box>
      <Box
        display={{
          base: isOpen ? 'flex' : 'none',
          lg: 'flex',
        }}
        gap="8px"
        flexDirection="column"
        marginTop="14px"
      >
        <Box display="flex" alignItems="center">
          <Box marginRight="8px"><Circle active={step >= 0 ? true : false} /></Box>
          <Box fontSize="14px" fontWeight={500} color="#161F36">Step 1: <Box as="span" fontWeight="400">Enter username/wallet address</Box></Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box marginRight="8px"><Circle active={step >= 1 ? true : false} /></Box>
          <Box fontSize="14px" fontWeight={500} color="#161F36">Step 2: <Box as="span" fontWeight="400">Add passkey</Box></Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box marginRight="8px"><Circle active={step >= 2 ? true : false} /></Box>
          <Box fontSize="14px" fontWeight={500} color="#161F36">Step 3: <Box as="span" fontWeight="400">Recovery contact confirmation</Box></Box>
        </Box>
      </Box>
    </Box>
  )
}
