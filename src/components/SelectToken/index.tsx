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
import TokenIcon from '../TokenIcon'

const SelectToken = ({ select, isOpen, onClose, setMenuRef }: any) => {
  const { tokenBalance } = useBalanceStore();
  console.log('T balance', tokenBalance)

  return (
    <Box
      ref={setMenuRef}
    >
      <Menu
        isOpen={isOpen}
        isLazy
      >
        {() => (
          <Box
            width="100%"
            overflow="auto"
          >
            <MenuList
              background="white"
              boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
              border="1px solid #F2F3F5"
              width={{
                base: 'calc(100vw - 60px)',
                lg: '420px'
              }}
            >
              {tokenBalance.map((token: any) =>
                <Box
                  key={token.name}
                  width="100%"
                  position="relative"
                  padding="0 16px"
                  onClick={() => { select(token); onClose() }}
                  display="flex"
                  alignItems="center"
                  height="48px"
                >
                  <Box marginRight="8px">
                    <TokenIcon address={token.contractAddress} size={36} />
                    {/* <Image width="36px" height="36px" flex='1 1 36px' src={token.logoURI} /> */}
                  </Box>
                  <Box fontSize="16px" fontWeight="500">{token.symbol}</Box>
                  <Box fontSize="12px" marginLeft="auto" color="#95979C">Balance: {toFixed(token.tokenBalanceFormatted, 3)}</Box>
                </Box>
              )}
            </MenuList>
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default SelectToken
