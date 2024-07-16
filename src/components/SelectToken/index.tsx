import { useEffect, useState, useRef } from 'react'
import {
  Box,
  Image,
  Menu,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react'
import USDCIcon from '@/assets/mobile/usdc.png'
import { useBalanceStore } from '@/store/balance'
import { toFixed } from '@/lib/tools'

const SelectToken = ({ select, isOpen, onClose }: any) => {
  const { tokenBalance } = useBalanceStore();
  console.log('T balance', tokenBalance)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      blockScrollOnMount={true}
    >
      <ModalOverlay height="100vh" background="transparent" />
      <ModalContent
        borderRadius="24px"
        justifyContent="flex-end"
        maxW={{
          sm: 'calc(100vw - 32px)',
          md: '430px',
        }}
        marginTop={{
          sm: `auto`,
          md: 'calc(50vh - 125px)',
        }}
        overflow="visible"
        mb="0"
        bottom="30px"
        position="relative"
        overflowY="scroll"
        boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
        border="1px solid #F2F3F5"
      >
        <ModalCloseButton />
        <ModalHeader fontSize="20px" fontWeight="500" color="#161F36" paddingBottom="2">Select Token</ModalHeader>
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          width="100%"
          paddingLeft="0"
          paddingRight="0"
        >
          <Box
            background="white"
            width="100%"

          >
            {tokenBalance.map((token: any) =>
              <Box
                key={token.name}
                width="100%"
                position="relative"
                padding="0 16px"
                onClick={() => select(token)}
                display="flex"
                alignItems="center"
                height="48px"
              >
                <Box marginRight="8px">
                  <Image width="36px" height="36px" src={token.logoURI} />
                </Box>
                <Box fontSize="16px" fontWeight="500">{token.name}</Box>
                <Box fontSize="12px" marginLeft="auto" color="#95979C">Balance: {toFixed(token.tokenBalanceFormatted, 6)}</Box>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SelectToken
